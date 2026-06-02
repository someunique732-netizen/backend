from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from .models import *
from .serializers import *


# ================= CUSTOMER =================
class CustomerViewSet(ModelViewSet):
    queryset = Customer.objects.all().order_by('-id')
    serializer_class = CustomerSerializer


# ================= CATEGORY =================
class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all().order_by('-id')
    serializer_class = CategorySerializer


# ================= ITEM =================
class ItemViewSet(ModelViewSet):
    queryset = Item.objects.select_related('category').all().order_by('-id')
    serializer_class = ItemSerializer


# ================= VARIANT =================
class ItemVariantViewSet(ModelViewSet):
    queryset = ItemVariant.objects.select_related('item').all().order_by('-id')
    serializer_class = ItemVariantSerializer


# ================= COUPON =================
class CouponViewSet(ModelViewSet):
    queryset = Coupon.objects.all().order_by('-id')
    serializer_class = CouponSerializer


# ================= ORDER =================
class OrderViewSet(ModelViewSet):

    queryset = Order.objects.select_related(
        'customer', 'coupon'
    ).prefetch_related(
        'items__variant'
    ).all().order_by('-id')

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return OrderReadSerializer
        return OrderSerializer

    @action(detail=True, methods=['post'])
    def cancel_order(self, request, pk=None):
        order = self.get_object()

        for item in order.items.all():
            variant = item.variant
            variant.stock += item.quantity
            variant.save()

        order.delete()

        return Response(
            {"message": "Order cancelled"},
            status=status.HTTP_200_OK
        )


# ================= SALES PERSON =================
class SalesPersonViewSet(ModelViewSet):
    queryset = SalesPerson.objects.all().order_by('-id')
    serializer_class = SalesPersonSerializer