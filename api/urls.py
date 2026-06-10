from django.urls import path, include
from rest_framework.routers import DefaultRouter

from api.services.Importing.Import_Items import ImportItemsView
from api.services.Report_Excel.Hastag import export_hastag_report

from .viewsets import (
    CustomerViewSet,
    CategoryViewSet,
    ItemViewSet,
    ItemVariantViewSet,
    OrderViewSet,
    CouponViewSet,
    SalesPersonViewSet
)

from .views import login_view, create_user , dashboard, monthly_revenue

router = DefaultRouter()

router.register(r'customers', CustomerViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'items', ItemViewSet)
router.register(r'variants', ItemVariantViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'coupons', CouponViewSet)
router.register(r'sales-persons', SalesPersonViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', login_view),
    path('create-user/', create_user),
    path(
        "reports/hastag/",
        export_hastag_report,
        name="hastag-report",
    ),
    path("dashboard/", dashboard),
    path("monthly-revenue/", monthly_revenue),
    path(
        "import-items/",
        ImportItemsView.as_view(),
        name="import-items"
    ),

]