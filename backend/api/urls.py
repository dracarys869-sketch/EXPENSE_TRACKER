from django.urls import path
from api import views

urlpatterns = [
    # Auth
    path('register', views.register),
    path('login', views.login),
    path('send-otp', views.send_otp),
    path('reset-password-otp', views.reset_password_otp),

    # Profile
    path('profile', views.profile_view),

    # Transactions
    path('transactions', views.transactions_list_create),
    path('transactions/<int:tx_id>', views.transaction_detail),

    # Categories
    path('categories', views.categories_list_create),
    path('categories/<int:cat_id>', views.category_detail),

    # Reports
    path('reports/monthly', views.report_monthly),
    path('reports/yearly', views.report_yearly),
    path('reports/category', views.report_category),
    path('reports/export/csv', views.export_csv),
    path('reports/export/pdf', views.export_pdf),

    # Budgets
    path('budgets', views.budgets_list_create),
    path('budgets/<int:budget_id>', views.budget_detail),

    # Recurring Expenses
    path('recurring', views.recurring_list_create),
    path('recurring/<int:item_id>/pay', views.recurring_pay),
    path('recurring/<int:item_id>', views.recurring_detail),

    # Savings Goals
    path('savings', views.savings_list_create),
    path('savings/<int:goal_id>/deposit', views.savings_deposit),
    path('savings/<int:goal_id>', views.savings_detail),

    # Settings
    path('settings', views.settings_view),

    # Notifications
    path('notifications', views.notifications_list),
    path('notifications/read-all', views.notifications_mark_read),
    path('notifications/send-digest', views.notifications_send_digest),
]
