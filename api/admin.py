from django.contrib import admin
from .models import (
    Customer,
    Category,
    Item,
    ItemVariant,
    Order,
    OrderItem,
    Coupon,
    SalesPerson
)


# 👤 CUSTOMER ADMIN
@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'customer_name',
        'phone1',
        'municipality',
        'created_at'
    )

    search_fields = (
        'customer_name',
        'phone1',
        'municipality'
    )

    list_filter = (
        'municipality',
        'created_at'
    )


# 📁 CATEGORY ADMIN
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'category_name',
        'created_at'
    )

    search_fields = (
        'category_name',
    )


# 📦 ITEM ADMIN
@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'item_name',
        'category',
        'cost_price',
        'selling_price',
        'market_price',
        'created_at'
    )

    search_fields = (
        'item_name',
    )

    list_filter = (
        'category',
        'created_at'
    )


# 🎨 ITEM VARIANT ADMIN
@admin.register(ItemVariant)
class ItemVariantAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'item',
        'size',
        'design',
        'stock',
        'sku',
        'barcode'
    )

    search_fields = (
        'item__item_name',
        'sku',
        'barcode'
    )

    list_filter = (
        'size',
        'design',
    )

    ordering = ('-id',)


# 🎟️ COUPON ADMIN
@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'code',
        'discount_percent',
        'active',
        'valid_from',
        'valid_to'
    )

    search_fields = (
        'code',
    )

    list_filter = (
        'active',
    )


# 📋 ORDER ITEM INLINE
class OrderItemInline(admin.TabularInline):

    model = OrderItem
    extra = 0
    readonly_fields = ('price',)


# 🧾 ORDER ADMIN
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'customer',
        'order_date',
        'get_total',
        'get_discount',
        'get_final'
    )

    search_fields = (
        'customer__customer_name',
    )

    list_filter = (
        'order_date',
        'coupon',
    )

    inlines = [OrderItemInline]

    def get_total(self, obj):
        return obj.total_amount()

    def get_discount(self, obj):
        return obj.discount_amount()

    def get_final(self, obj):
        return obj.final_amount()


# 📋 ORDER ITEM ADMIN
@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'order',
        'variant',
        'quantity',
        'price',
    )


# 👨‍💼 SALES PERSON ADMIN
@admin.register(SalesPerson)
class SalesPersonAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'full_name',
        'role',
        'phone',
        'email',
        'is_active',
        'created_at'
    )

    search_fields = (
        'full_name',
        'phone',
        'email'
    )

    list_filter = (
        'role',
        'is_active',
        'created_at'
    )

    ordering = ('-id',)