from django.db import transaction

from api.models import (
    Order,
    OrderItem,
    ItemVariant,
)


class OrderService:

    @staticmethod
    @transaction.atomic
    def create_order(validated_data):

        customer = validated_data["customer"]
        items = validated_data["items"]

        order = Order.objects.create(
            customer=customer,
            delivery_charge=validated_data.get(
                "delivery_charge",
                0
            ),
            paid_amount=validated_data.get(
                "paid_amount",
                0
            ),
            coupon=validated_data.get(
                "coupon",
                None
            ),
        )

        order_items = []

        for i in items:

            variant = ItemVariant.objects.get(
                id=i["variant"].id
            )

            if variant.stock < i["quantity"]:
                raise Exception(
                    f"Not enough stock for {variant.sku}"
                )

            variant.stock -= i["quantity"]
            variant.save()

            order_items.append(
                OrderItem(
                    order=order,
                    variant=variant,
                    quantity=i["quantity"],
                    price=variant.item.selling_price,
                )
            )

        OrderItem.objects.bulk_create(
            order_items
        )

        return order