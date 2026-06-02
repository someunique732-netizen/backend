# services/Report_Excel/hastag_report.py

from django.utils import timezone

from django.http import HttpResponse
from openpyxl import Workbook
from api.models import Order
from api.utils.branch_finder import find_branch


def export_hastag_report(request):
    today = timezone.localdate()

    wb = Workbook()
    ws = wb.active
    ws.title = "Orders"

    headers = [
        "SN",
        "Vendor ID",
        "Name",
        "From",
        "To",
        "Address",
        "Phone1",
        "Phone2",
        "COD",
        "Remark",
        "Delivery Type",
        "Paid",
    ]

    ws.append(headers)

    orders = (
        Order.objects
        .select_related("customer")
        .filter(order_date__date=today)
        .order_by("id")
    )

    for sn, order in enumerate(orders, start=1):

        month = order.order_date.month
        day = order.order_date.day

        vendor_id = (
            f"{month:02d}"
            f"{day:02d}"
            f"{sn:02d}"
        )

        customer = order.customer

        ws.append([
            sn,
            vendor_id,
            customer.customer_name,
            "SURYABINAYAK",
            find_branch(
                customer.municipality,
                customer.address
            ),
            customer.address,
            customer.phone1,
            customer.phone2 or "",
            float(order.cod_amount()),
            customer.remark or "",
            getattr(order, "delivery_type", ""),
            float(order.paid_amount),
        ])

    response = HttpResponse(
        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )

    response["Content-Disposition"] = (
        'attachment; filename="hastag_report.xlsx"'
    )

    wb.save(response)

    return response