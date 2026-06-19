from django.db import models
from decimal import Decimal
from django.utils import timezone
from django.contrib.auth.models import User



# 👤 CUSTOMER
class Customer(models.Model):
    customer_name = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    municipality = models.CharField(max_length=100)
    phone1 = models.CharField(max_length=10)
    phone2 = models.CharField(max_length=10, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.customer_name


# 📁 CATEGORY
class Category(models.Model):
    category_name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.category_name

class Item(models.Model):
    category = models.ForeignKey(
        'Category',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='items'
    )
    item_name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='items/', null=True, blank=True)

    cost_price = models.DecimalField(max_digits=10, decimal_places=2)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)
    market_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.item_name


class ItemVariant(models.Model):
    item = models.ForeignKey(
        Item,
        on_delete=models.CASCADE,
        related_name='variants'
    )

    size = models.CharField(max_length=20, blank=True, null=True)
    design = models.CharField(max_length=50, blank=True, null=True)

    stock = models.PositiveIntegerField(default=0)
    minimum_stock = models.PositiveIntegerField(default=5)

    sku = models.CharField(max_length=50, unique=True)
    barcode = models.CharField(max_length=50, unique=True, db_index=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['item', 'size', 'design'],
                name='unique_item_variant'
            )
        ]

    @property
    def is_low_stock(self):
        return self.stock <= self.minimum_stock

    def __str__(self):
        return f"{self.item.item_name} - {self.size or ''} - {self.design or ''}".strip(" -")


# 🎟️ COUPON
class Coupon(models.Model):
    code = models.CharField(max_length=20, unique=True)
    discount_percent = models.DecimalField(max_digits=5, decimal_places=2)
    active = models.BooleanField(default=True)
    valid_from = models.DateTimeField()
    valid_to = models.DateTimeField()
    min_order_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def is_valid(self):
        now = timezone.now()
        return self.active and self.valid_from <= now <= self.valid_to


# 🧾 ORDER
class Order(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="orders")
    salesperson = models.ForeignKey('SalesPerson',on_delete=models.SET_NULL,null=True,blank=True,related_name='orders')
    coupon = models.ForeignKey(Coupon, on_delete=models.SET_NULL, null=True, blank=True)
    delivery_charge = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    remark = models.TextField(blank=True, null=True)
    order_date = models.DateTimeField(auto_now_add=True)

    def total_amount(self):
        return sum(item.total_price() for item in self.items.all())

    def discount_amount(self):
        if self.coupon and self.coupon.is_valid():
            return self.total_amount() * (self.coupon.discount_percent / 100)
        return Decimal("0")

    def final_amount(self):
        return self.total_amount() + self.delivery_charge - self.paid_amount - self.discount_amount()


# 📋 ORDER ITEM
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    variant = models.ForeignKey(ItemVariant, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def total_price(self):
        return self.quantity * self.price


# 👨‍💼 SALES PERSON
class SalesPerson(models.Model):
    
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="salesperson"
    )
    
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('manager', 'Manager'),
        ('sales', 'Sales'),
    ]


    full_name = models.CharField(max_length=100)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='sales')
    phone = models.CharField(max_length=10, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)

    address = models.TextField(blank=True, null=True)  # ✅ ADD THIS

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name

