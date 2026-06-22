from ..models import Order, OrderItem, StockLog
from rest_framework.exceptions import ValidationError
from django.db import transaction

class OrderService:

    @staticmethod
    @transaction.atomic
    def create_order(validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)

        order_items = []
        for i in items_data:
            variant = i['variant']
            qty     = i['quantity']

            if variant.stock < qty:
                raise ValidationError(
                    f"Not enough stock for '{variant.sku}' "
                    f"(available: {variant.stock}, requested: {qty})"
                )

            variant.stock -= qty
            variant.save()

            StockLog.objects.create(
                variant         = variant,
                quantity_change = -qty,
                reason          = 'order',
                note            = f'Order #{order.id}',
                stock_after     = variant.stock,
            )

            order_items.append(OrderItem(
                order=order, variant=variant,
                quantity=qty, price=variant.item.selling_price,
            ))

        OrderItem.objects.bulk_create(order_items)
        return order