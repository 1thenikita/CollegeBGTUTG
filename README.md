# ПК БГТУ
Система для оповещения студентов Политехнического колледжа.
# Перед использованием БД

1. Включить TCP/IP подключение
2. Разрешить использование пары логин пароля

Желательно после этого перезапустить БД.


Если не поможет можете рискнуть использовать данный код
```USE master
GO
xp_readerrorlog 0, 1, N'Server is listening on',N'', NULL, NULL, N'asc'
GO
```