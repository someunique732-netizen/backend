from rest_framework import serializers
from .models import *
from .services.order_service import OrderService
from django.db.models import Sum

# ================= CUSTOMER =================
class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = "__all__"


# ================= CATEGORY =================
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"

# ================= VARIANT =================
class ItemVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemVariant
        fields = "__all__"


# ================= ITEM =================
class ItemSerializer(serializers.ModelSerializer):

    variants = ItemVariantSerializer(many=True, read_only=True)
    stock = serializers.SerializerMethodField()

    class Meta:
        model = Item
        fields = "__all__"

    def get_stock(self, obj):
        return obj.variants.aggregate(total=Sum("stock"))["total"] or 0


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

    class Meta:
        model = OrderItem
        fields = "__all__"


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
            "delivery_charge",
            "paid_amount",
            "coupon",
            "items",
        ]

    def create(self, validated_data):
        return OrderService.create_order(validated_data)


# ================= ORDER READ =================
class OrderReadSerializer(serializers.ModelSerializer):

    customer = CustomerSerializer(read_only=True)

    items = OrderItemSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Order
        fields = "__all__"


# ================= SALES PERSON =================
class SalesPersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesPerson
        fields = "__all__"