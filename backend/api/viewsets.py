from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend

from .models import *
from .serializers import *


# ================= CUSTOMER =================
class CustomerViewSet(ModelViewSet):
    queryset = Customer.objects.all().order_by('-id')
    serializer_class = CustomerSerializer

    filter_backends = [SearchFilter]
    search_fields = [
        'customer_name',
        'phone1',
        'phone2',
    ]


# ================= CATEGORY =================
class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all().order_by('-id')
    serializer_class = CategorySerializer

    filter_backends = [SearchFilter]
    search_fields = ['category_name']


# ================= ITEM =================
class ItemViewSet(ModelViewSet):
    queryset = Item.objects.select_related(
        'category'
    ).all().order_by('-id')

    serializer_class = ItemSerializer

    filter_backends = [SearchFilter]
    search_fields = ['item_name']


# ================= VARIANT =================
class ItemVariantViewSet(ModelViewSet):
    queryset = ItemVariant.objects.select_related(
        'item'
    ).all().order_by('-id')

    serializer_class = ItemVariantSerializer

    filter_backends = [SearchFilter]
    search_fields = [
        'sku',
        'barcode',
        'item__item_name',
    ]


# ================= COUPON =================
class CouponViewSet(ModelViewSet):
    queryset = Coupon.objects.all().order_by('-id')
    serializer_class = CouponSerializer

    filter_backends = [SearchFilter]
    search_fields = ['code']


# ================= ORDER =================
class OrderViewSet(ModelViewSet):

    queryset = Order.objects.select_related(
        'customer',
        'coupon',
        'salesperson'
    ).prefetch_related(
        'items__variant__item'
    ).all().order_by('-id')

    filter_backends = [DjangoFilterBackend, SearchFilter]

    filterset_fields = [
        'customer',
        'salesperson',
        'coupon',
    ]

    search_fields = [
        'customer__customer_name',
        'salesperson__full_name',
        'remark',
    ]

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
            {"message": "Order cancelled successfully"},
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['get'])
    def summary(self, request):
        total_orders = Order.objects.count()

        total_sales = sum(
            order.total_amount()
            for order in Order.objects.all()
        )

        return Response({
            "total_orders": total_orders,
            "total_sales": total_sales,
        })


# ================= SALES PERSON =================
class SalesPersonViewSet(ModelViewSet):
    queryset = SalesPerson.objects.all().order_by('-id')
    serializer_class = SalesPersonSerializer

    filter_backends = [SearchFilter]
    search_fields = [
        'full_name',
        'phone',
        'email',
    ]