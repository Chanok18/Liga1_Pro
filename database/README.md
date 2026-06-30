# Base de datos Liga1 Pro

## Importar en MySQL

1. Crear la base de datos:

```sql
CREATE DATABASE IF NOT EXISTS liga1pro_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

2. Importar el dump:

```powershell
mysql -u root -p liga1pro_db < database/liga1pro_db.sql
```

3. Revisar que el backend apunte a esa base:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/liga1pro_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=TU_PASSWORD
```

El archivo de configuracion esta en `src/main/resources/application-dev.properties`.
