# User API

>  **Responsible for manage the users, some of the routes require authentication some don't.**

## /user
#### POST [/user/signup]

> Create a User with permission to authenticate.
``` 
Example :
{
  username: 'allan.murara@gmail.com',
    password: '1234'
}
```

### Auth Parameters 
| Attribute | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `authorization` | header | no | JWT Token  |


### Parameters
| Attribute | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `username` | string | yes | Should provide valid user email |
| `password` | string | yes | User password|


### Response
```
status: 200 OK
{
  token: 'validtokenjson'
}
```
##


#### PUT [/user/:email]

> Update an user info based on email.
``` 
Example :
{
  age: '26'
}
```
### Auth Parameters 
| Attribute | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `authorization` | header | not if using auth/session. required for jwt | JWT Token  |


### Parameters (Only accept `age` and `city`)
| Attribute | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `age` | integer | optional | Should provide valid Integer value |
| `city` | string | optional | Should provide valid String |


### Response

```
status: 200 OK
{
  updated: true
}
```

##


#### DELETE [/user]

> Delete your own user.

### Auth Parameters 
| Attribute | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `authorization` | header | not if using auth/session. required for jwt  | JWT Token |

### Response
```
status: 200 OK
{
  deleted: true
}
```

##

#### GET [/user]

> Get your user information.

### Auth Parameters 
| Attribute | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `authorization` | header | not if using auth/session. required for jwt  | JWT Token |
### Response
```
status: 200 OK
{
  user: {
      email: 'allan.murara@gmail.com',
      age: '26',
      city: 'Jaraguá do Sul'
    }
}
```

##


