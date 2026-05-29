from django.db import transaction
from ..models import Order, OrderItem, Item


class OrderService:

    @staticmethod
    @transaction.atomic
    def create_order(validated_data):

        customer = validated_data['customer']
        items = validated_data['items']

        order = Order.objects.create(
            customer=customer,
            delivery_charge=validated_data.get('delivery_charge', 0),
            paid_amount=validated_data.get('paid_amount', 0),
            coupon=validated_data.get('coupon', None)
        )

        order_items = []

        for i in items:

            item = Item.objects.get(id=i['item'])

            if item.stock < i['quantity']:
                raise Exception("Not enough stock")

            item.stock -= i['quantity']
            item.save()

            order_items.append(
                OrderItem(
                    order=order,
                    item=item,
                    quantity=i['quantity'],
                    price=item.selling_price
                )
            )

        OrderItem.objects.bulk_create(order_items)

        return order