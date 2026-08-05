import pymysql
from django.db.backends.base.base import BaseDatabaseWrapper
from django.db.backends.mysql.features import DatabaseFeatures

pymysql.version_info = (2, 2, 1, 'final', 0)
pymysql.install_as_MySQLdb()

BaseDatabaseWrapper.check_database_version_supported = lambda self: None

DatabaseFeatures.can_return_columns_from_insert = property(lambda self: False)
DatabaseFeatures.can_return_rows_from_bulk_insert = property(lambda self: False)
