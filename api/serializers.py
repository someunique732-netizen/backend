from rest_framework import serializers
from .models import *
from .services.order_service import OrderService
from django.db.models import Sum

# ================= CUSTOMER =================
class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = "__all__"

    def validate_phone1(self, value):
        qs = Customer.objects.filter(phone1=value)

        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)

        if qs.exists():
            raise serializers.ValidationError(
                "Customer with this phone number already exists."
            )

        return value


# ================= CATEGORY =================
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"

# ================= VARIANT =================
class ItemVariantSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(
        source="item.item_name",
        read_only=True
    )

    class Meta:
        model = ItemVariant
        fields = "__all__"

# ================= ITEM =================
class ItemSerializer(serializers.ModelSerializer):

    variants = ItemVariantSerializer(many=True, read_only=True)
    stock = serializers.SerializerMethodField()

    category_name = serializers.CharField(
        source="category.category_name",
        read_only=True
    )

    class Meta:
        model = Item
        fields = "__all__"

    def get_stock(self, obj):
        return obj.variants.aggregate(
            total=Sum("stock")
        )["total"] or 0
    
# ================= COUPON =================
class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = "__all__"


# ================= ORDER ITEM READ =================
class OrderItemSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(
        source="variant.item.item_name",
        read_only=True
    )

    size = serializers.CharField(
        source="variant.size",
        read_only=True
    )

    sku = serializers.CharField(
        source="variant.sku",
        read_only=True
    )

    total_price = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = "__all__"

    def get_total_price(self, obj):
        return obj.total_price()


# ================= ORDER ITEM WRITE =================
class OrderItemWriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = OrderItem
        fields = ["variant", "quantity"]


# ================= ORDER WRITE =================
class OrderSerializer(serializers.ModelSerializer):

    items = OrderItemWriteSerializer(many=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "customer",
            "status",
            "salesperson",
            "delivery_charge",
            "paid_amount",
            "coupon",
            "items",
            "remark"
        ]

    def create(self, validated_data):
        return OrderService.create_order(validated_data)

# ================= SALES PERSON =================
class SalesPersonSerializer(serializers.ModelSerializer):
    total_orders = serializers.SerializerMethodField()

    class Meta:
        model = SalesPerson
        fields = "__all__"

    def get_total_orders(self, obj):
        return obj.orders.count()

# ================= ORDER READ =================
class OrderReadSerializer(serializers.ModelSerializer):
    
    customer = CustomerSerializer(read_only=True)

    salesperson = SalesPersonSerializer(read_only=True)

    items = OrderItemSerializer(
        many=True,
        read_only=True
    )

    total_amount = serializers.SerializerMethodField()
    discount_amount = serializers.SerializerMethodField()
    final_amount = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = "__all__"

    def get_total_amount(self, obj):
        return obj.total_amount()

    def get_discount_amount(self, obj):
        return obj.discount_amount()

    def get_final_amount(self, obj):
        return obj.final_amount()

