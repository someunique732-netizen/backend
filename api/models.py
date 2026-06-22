from django.db import models
from decimal import Decimal
from django.utils import timezone
from django.contrib.auth.models import User


# 👤 CUSTOMER
class Customer(models.Model):
    customer_name = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    municipality = models.CharField(max_length=100)
    phone1 = models.CharField(max_length=10,unique=True,db_index=True)
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


# 📦 ITEM
class Item(models.Model):
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name="items")
    item_name = models.CharField(max_length=100)

    image = models.ImageField(upload_to="items/", null=True, blank=True)  # ✅ ADD THIS

    cost_price = models.DecimalField(max_digits=10, decimal_places=2)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)
    market_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.item_name


# 🎨 VARIANT
class ItemVariant(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name="variants")
    size = models.CharField(max_length=20)
    design = models.CharField(max_length=50)
    stock = models.IntegerField(default=0)
    sku = models.CharField(max_length=50, unique=True)
    barcode = models.CharField(max_length=50, unique=True,db_index=True)

    def __str__(self):
        return f"{self.item.item_name} - {self.size}"


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
    DELIVERY_CHOICES = [
        ("Door2Door", "Door to Door"),
        ("Door2Branch", "Door to Branch"),
    ]

    delivery_method = models.CharField(
        max_length=20,
        choices=DELIVERY_CHOICES,
        default="Door2Door"
    )
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("packed", "Packed"),
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )
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
        blank=True
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

# Company Info 
class Company(models.Model):
    company_name = models.CharField(max_length=200)

    logo = models.ImageField(
        upload_to="company/",
        null=True,
        blank=True
    )

    phone = models.CharField(max_length=20)

    email = models.EmailField(
        blank=True,
        null=True
    )

    qr_code = models.ImageField(
        upload_to="qr/",
        blank=True,
        null=True
    )

    address = models.TextField()

    website = models.CharField(
        max_length=200,
        blank=True,
        null=True
    )

#Stock Log
class StockLog(models.Model):
    REASON_CHOICES = [
        ('restock',      'Manual restock'),
        ('order',        'Order placed'),
        ('cancellation', 'Order cancelled'),
        ('correction',   'Manual correction'),
    ]

    variant       = models.ForeignKey(ItemVariant, on_delete=models.CASCADE, related_name='stock_logs')
    quantity_change = models.IntegerField()          # positive = stock added, negative = stock removed
    reason        = models.CharField(max_length=20, choices=REASON_CHOICES)
    note          = models.TextField(blank=True, null=True)
    performed_by  = models.ForeignKey(SalesPerson, on_delete=models.SET_NULL, null=True, blank=True)
    stock_after   = models.IntegerField()            # snapshot so history is self-contained
    created_at    = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.variant.sku} | {self.quantity_change:+d} | {self.reason}"