from rest_framework import serializers
from .models import *
from .services.order_service import OrderService
from django.db.models import Sum

import json

# ================= CUSTOMER =================
class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = "__all__"


# ================= CATEGORY =================
class CategorySerializer(serializers.ModelSerializer):

    total_items = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = "__all__"

    def get_total_items(self, obj):
        return obj.items.count()

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

    variants = ItemVariantSerializer(
        many=True,
        required=False
    )

    total_stock = serializers.SerializerMethodField()

    category = CategorySerializer(read_only=True)

    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True
    )

    class Meta:
        model = Item
        fields = "__all__"

    def create(self, validated_data):

        request = self.context.get("request")

        variants_data = []

        if request:
            variants_json = request.data.get("variants")

            if variants_json:
                variants_data = json.loads(
                    variants_json
                )

        item = Item.objects.create(
            **validated_data
        )

        for variant in variants_data:
            ItemVariant.objects.create(
                item=item,
                **variant
            )

        return item

    def get_total_stock(self, obj):
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

