# Project: Authentication_kemendikbud
# 📁 Collection: AUTH 


## End-point: LOGIN
### Method: POST
>```
>{{BASE_URL}}/auth/users/login
>```
### Body (**raw**)

```json
{
    "email_username": "agam.indra@bvarta.com",
    "password": "Bvarta2021!"
}
```

### 🔑 Authentication noauth

|Param|value|Type|
|---|---|---|


### Response: undefined
```json
null
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: REQUEST FORGOT PASSWORD
### Method: POST
>```
>{{AUTH_URL}}/reset/request-forgot-password
>```
### Body (**raw**)

```json
{
    "email_username": "stack7705@gmail.com"
}
```

### Response: undefined
```json
null
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: RESET-FORGOT-PASSWORD
### Method: POST
>```
>{{BASE_URL}}/auth/reset/forgot-password
>```
### Body (**raw**)

```json
{
    "password":"123",
    "password_confirmation":"123",
    "resetToken":"ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBaQ0k2TkRNc0ltVnRZV2xzSWpvaWJHOTFhWE11ZG1Gc1pXNUFZblpoY25SaExtTnZiU0lzSW1saGRDSTZNVFkxTlRRMU5qWXlNU3dpWlhod0lqb3hOalUxTkRZM05ESXhmUS51VGhfRXNOazJJclFwZlRIdmUzNTFNTUgxMkVkNF9IRGc5Mm42MkpnVFJ3"   
}
```

### Response: undefined
```json
null
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: CHECK-TOKEN
### Method: GET
>```
>{{AUTH_URL}}/check-token
>```
### 🔑 Authentication bearer

|Param|value|Type|
|---|---|---|
|token|{{token}}|string|


### Response: 200
```json
{
    "status_code": 200,
    "message": "Auth Successfully",
    "data": {
        "id": 3354,
        "id_users": "26",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjYsInVzZXJuYW1lIjoiYWRtaW4iLCJtb2JpbGVfbnVtYmVyIjpudWxsLCJwb3NpdGlvbiI6bnVsbCwiZGVwYXJ0bWVudCI6bnVsbCwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJmaXJzdG5hbWUiOiJhZG1pbiIsImxhc3RuYW1lIjoiYWRtaW4iLCJzdGF0dXMiOm51bGwsImxhc3RfbG9naW4iOiIyMDIyLTA2LTA4VDAzOjMwOjE4LjAwMFoiLCJsYXN0X2xvZ291dCI6bnVsbCwiY3JlYXRlZF9hdCI6bnVsbCwidXBkYXRlZF9hdCI6bnVsbCwiY3JlYXRlZF9ieSI6bnVsbCwicm9sZSI6eyJpZCI6NCwicGVybWlzc2lvbnMiOnsic3VwZXJBZG1pbiI6eyJ1c2VycyI6eyJyZWFkIjoidHJ1ZSIsImNyZWF0ZSI6InRydWUiLCJkZWxldGUiOiJ0cnVlIiwidXBkYXRlIjoidHJ1ZSIsInZpZXctZGV0YWlsIjoidHJ1ZSJ9LCJjb21wYW55Ijp7InJlYWQiOiJ0cnVlIiwiY3JlYXRlIjoidHJ1ZSIsImRlbGV0ZSI6InRydWUiLCJ1cGRhdGUiOiJ0cnVlIiwidmlldy1kZXRhaWwiOiJ0cnVlIn0sImRhc2hib2FyZCI6eyJyZWFkIjoidHJ1ZSJ9LCJzdXBlckFkbWluIjoidHJ1ZSIsImFsbERhdGFHcm91cCI6InRydWUiLCJhY2Nlc3NpYmlsaXR5Ijp7InJlYWQiOiJ0cnVlIiwiY3JlYXRlIjoidHJ1ZSIsImRlbGV0ZSI6InRydWUiLCJ1cGRhdGUiOiJ0cnVlIiwidmlldy1kZXRhaWwiOiJ0cnVlIn19fSwiZGVzY3JpcHRpb24iOiJTdXBlcmFkbWluIEludGVybmFsIGJ2YXJ0YSIsIm5hbWUiOiJzdXBlciBhZG1pbiIsInNsdWciOiJzdXBlci1hZG1pbi1idmFydGEiLCJjcmVhdGVkX2F0IjpudWxsLCJ1cGRhdGVkX2F0IjpudWxsLCJkZWxldGVkX2F0IjpudWxsLCJ1cGRhdGVkX2J5IjpudWxsLCJjcmVhdGVkX2J5IjpudWxsLCJkZWxldGVkX2J5IjpudWxsfSwiY29tcGFueSI6bnVsbCwiaWF0IjoxNjU0NzY0NTk2LCJleHAiOjE2NTQ3NzUzOTZ9._Tgw5GuK7uFuATRMBVApK60XFwlGoGEKx73eOfFu4V0",
        "status_is_valid": true,
        "created_at": "2022-06-09T08:15:51.000Z"
    },
    "request": {
        "status_code": 200,
        "message": "Success",
        "url": "/check-token"
    }
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: REFRESH-TOKEN
### Method: POST
>```
>{{AUTH_URL}}/refresh-token
>```
### Body (**raw**)

```json
{
    "email_username": "admin",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjYsInVzZXJuYW1lIjoiYWRtaW4iLCJtb2JpbGVfbnVtYmVyIjpudWxsLCJwb3NpdGlvbiI6bnVsbCwiZGVwYXJ0bWVudCI6bnVsbCwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJmaXJzdG5hbWUiOiJhZG1pbiIsImxhc3RuYW1lIjoiYWRtaW4iLCJzdGF0dXMiOm51bGwsImxhc3RfbG9naW4iOiIyMDIyLTA2LTA4VDAzOjMwOjE4LjAwMFoiLCJsYXN0X2xvZ291dCI6bnVsbCwiY3JlYXRlZF9hdCI6bnVsbCwidXBkYXRlZF9hdCI6bnVsbCwiY3JlYXRlZF9ieSI6bnVsbCwicm9sZSI6eyJpZCI6NCwicGVybWlzc2lvbnMiOnsic3VwZXJBZG1pbiI6eyJ1c2VycyI6eyJyZWFkIjoidHJ1ZSIsImNyZWF0ZSI6InRydWUiLCJkZWxldGUiOiJ0cnVlIiwidXBkYXRlIjoidHJ1ZSIsInZpZXctZGV0YWlsIjoidHJ1ZSJ9LCJjb21wYW55Ijp7InJlYWQiOiJ0cnVlIiwiY3JlYXRlIjoidHJ1ZSIsImRlbGV0ZSI6InRydWUiLCJ1cGRhdGUiOiJ0cnVlIiwidmlldy1kZXRhaWwiOiJ0cnVlIn0sImRhc2hib2FyZCI6eyJyZWFkIjoidHJ1ZSJ9LCJzdXBlckFkbWluIjoidHJ1ZSIsImFsbERhdGFHcm91cCI6InRydWUiLCJhY2Nlc3NpYmlsaXR5Ijp7InJlYWQiOiJ0cnVlIiwiY3JlYXRlIjoidHJ1ZSIsImRlbGV0ZSI6InRydWUiLCJ1cGRhdGUiOiJ0cnVlIiwidmlldy1kZXRhaWwiOiJ0cnVlIn19fSwiZGVzY3JpcHRpb24iOiJTdXBlcmFkbWluIEludGVybmFsIGJ2YXJ0YSIsIm5hbWUiOiJzdXBlciBhZG1pbiIsInNsdWciOiJzdXBlci1hZG1pbi1idmFydGEiLCJjcmVhdGVkX2F0IjpudWxsLCJ1cGRhdGVkX2F0IjpudWxsLCJkZWxldGVkX2F0IjpudWxsLCJ1cGRhdGVkX2J5IjpudWxsLCJjcmVhdGVkX2J5IjpudWxsLCJkZWxldGVkX2J5IjpudWxsfSwiY29tcGFueSI6bnVsbCwiaWF0IjoxNjU0NzY0NTk2LCJleHAiOjE2NTQ3NzUzOTZ9._Tgw5GuK7uFuATRMBVApK60XFwlGoGEKx73eOfFu4V0"
}
```

### 🔑 Authentication bearer

|Param|value|Type|
|---|---|---|
|token|eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjYsInVzZXJuYW1lIjoiYWRtaW4iLCJtb2JpbGVfbnVtYmVyIjpudWxsLCJwb3NpdGlvbiI6bnVsbCwiZGVwYXJ0bWVudCI6bnVsbCwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJmaXJzdG5hbWUiOiJhZG1pbiIsImxhc3RuYW1lIjoiYWRtaW4iLCJzdGF0dXMiOm51bGwsImxhc3RfbG9naW4iOiIyMDIyLTA2LTA4VDAzOjMwOjE4LjAwMFoiLCJsYXN0X2xvZ291dCI6bnVsbCwiY3JlYXRlZF9hdCI6bnVsbCwidXBkYXRlZF9hdCI6bnVsbCwiY3JlYXRlZF9ieSI6bnVsbCwicm9sZSI6eyJpZCI6NCwicGVybWlzc2lvbnMiOnsic3VwZXJBZG1pbiI6eyJ1c2VycyI6eyJyZWFkIjoidHJ1ZSIsImNyZWF0ZSI6InRydWUiLCJkZWxldGUiOiJ0cnVlIiwidXBkYXRlIjoidHJ1ZSIsInZpZXctZGV0YWlsIjoidHJ1ZSJ9LCJjb21wYW55Ijp7InJlYWQiOiJ0cnVlIiwiY3JlYXRlIjoidHJ1ZSIsImRlbGV0ZSI6InRydWUiLCJ1cGRhdGUiOiJ0cnVlIiwidmlldy1kZXRhaWwiOiJ0cnVlIn0sImRhc2hib2FyZCI6eyJyZWFkIjoidHJ1ZSJ9LCJzdXBlckFkbWluIjoidHJ1ZSIsImFsbERhdGFHcm91cCI6InRydWUiLCJhY2Nlc3NpYmlsaXR5Ijp7InJlYWQiOiJ0cnVlIiwiY3JlYXRlIjoidHJ1ZSIsImRlbGV0ZSI6InRydWUiLCJ1cGRhdGUiOiJ0cnVlIiwidmlldy1kZXRhaWwiOiJ0cnVlIn19fSwiZGVzY3JpcHRpb24iOiJTdXBlcmFkbWluIEludGVybmFsIGJ2YXJ0YSIsIm5hbWUiOiJzdXBlciBhZG1pbiIsInNsdWciOiJzdXBlci1hZG1pbi1idmFydGEiLCJjcmVhdGVkX2F0IjpudWxsLCJ1cGRhdGVkX2F0IjpudWxsLCJkZWxldGVkX2F0IjpudWxsLCJ1cGRhdGVkX2J5IjpudWxsLCJjcmVhdGVkX2J5IjpudWxsLCJkZWxldGVkX2J5IjpudWxsfSwiY29tcGFueSI6bnVsbCwiaWF0IjoxNjU0NzY0NTk2LCJleHAiOjE2NTQ3NzUzOTZ9._Tgw5GuK7uFuATRMBVApK60XFwlGoGEKx73eOfFu4V0|string|


### Response: 200
```json
{
    "status_code": 200,
    "message": "Succes Refresh Token",
    "data": {
        "token": {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjYsInVzZXJuYW1lIjoiYWRtaW4iLCJtb2JpbGVfbnVtYmVyIjpudWxsLCJwb3NpdGlvbiI6bnVsbCwiZGVwYXJ0bWVudCI6bnVsbCwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJmaXJzdG5hbWUiOiJhZG1pbiIsImxhc3RuYW1lIjoiYWRtaW4iLCJzdGF0dXMiOm51bGwsImxhc3RfbG9naW4iOiIyMDIyLTA2LTA5VDA4OjE1OjUxLjAwMFoiLCJsYXN0X2xvZ291dCI6bnVsbCwiY3JlYXRlZF9hdCI6bnVsbCwidXBkYXRlZF9hdCI6bnVsbCwiY3JlYXRlZF9ieSI6bnVsbCwicm9sZSI6eyJpZCI6NCwicGVybWlzc2lvbnMiOnsic3VwZXJBZG1pbiI6eyJ1c2VycyI6eyJyZWFkIjoidHJ1ZSIsImNyZWF0ZSI6InRydWUiLCJkZWxldGUiOiJ0cnVlIiwidXBkYXRlIjoidHJ1ZSIsInZpZXctZGV0YWlsIjoidHJ1ZSJ9LCJjb21wYW55Ijp7InJlYWQiOiJ0cnVlIiwiY3JlYXRlIjoidHJ1ZSIsImRlbGV0ZSI6InRydWUiLCJ1cGRhdGUiOiJ0cnVlIiwidmlldy1kZXRhaWwiOiJ0cnVlIn0sImRhc2hib2FyZCI6eyJyZWFkIjoidHJ1ZSJ9LCJzdXBlckFkbWluIjoidHJ1ZSIsImFsbERhdGFHcm91cCI6InRydWUiLCJhY2Nlc3NpYmlsaXR5Ijp7InJlYWQiOiJ0cnVlIiwiY3JlYXRlIjoidHJ1ZSIsImRlbGV0ZSI6InRydWUiLCJ1cGRhdGUiOiJ0cnVlIiwidmlldy1kZXRhaWwiOiJ0cnVlIn19fSwiZGVzY3JpcHRpb24iOiJTdXBlcmFkbWluIEludGVybmFsIGJ2YXJ0YSIsIm5hbWUiOiJzdXBlciBhZG1pbiIsInNsdWciOiJzdXBlci1hZG1pbi1idmFydGEiLCJjcmVhdGVkX2F0IjpudWxsLCJ1cGRhdGVkX2F0IjpudWxsLCJkZWxldGVkX2F0IjpudWxsLCJ1cGRhdGVkX2J5IjpudWxsLCJjcmVhdGVkX2J5IjpudWxsLCJkZWxldGVkX2J5IjpudWxsfSwiY29tcGFueSI6bnVsbCwiaWF0IjoxNjU0NzY3NTQxLCJleHAiOjE2NTQ3NzgzNDF9.y2eMka_4zSTjVcMujTDHSIzupe_jEZu7Z0vDlYFlXFQ"
        }
    },
    "request": {
        "status_code": 200,
        "message": "Success",
        "url": "/refresh-token"
    }
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: LOGOUT
### Method: POST
>```
>{{AUTH_URL}}/users/logout
>```
### 🔑 Authentication bearer

|Param|value|Type|
|---|---|---|
|token|{{token}}|string|



⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃
_________________________________________________
Powered By: [postman-to-markdown](https://github.com/bautistaj/postman-to-markdown/)
