#How to use API
- User phone is the primary key for the API
- User phone and token are sent via headers so if this were in prod env, Https would be required for at least some level of security
- HTTP Methods are specifically required only when needed, so the API is kind of RESTful, not 100% REST

##User manipulation
 curl --data '{ "phone":"0000000001", "firstName":"Zlatin", "lastName":"Stanimirovv", "email":"zlatin@zlat.in", "password": "123aaa", "address": "nowhere"}' localhost:8000/user
 curl -X 'PUT' --data '{ "firstName":"Zlatin", "lastName":"Stanimirovv", "email":"zlatin@zlat.in", "password": "123aaa", "address": "nowhere"}' localhost:8000/user
 curl -X 'DELETE' --data '{"phone": "0000000001"' localhost:8000/user

##Authentication
curl localhost:8000/login --data '' -H 'phone:0000000001' -H 'password:123aaa'
curl localhost:8000/logout --data '' -H 'phone:0000000001' -H 'token:dpOrtT03oo'

## Orders

get items
curl localhost:8000/items -H 'phone:0000000001' -H 'token:dpOrtT03oo'

add item to cart
curl localhost:8000/addToCart --data '{"itemID":"pizza1"}' -H 'phone:0000000001' -H 'token:dpOrtT03oo'

place order
curl localhost:8000/placeOrder --data '' -H 'phone:0000000001' -H 'token:dpOrtT03oo'

clear cart
curl localhost:8000/addToCart --data '{"itemID":"pizza1"}' -H 'phone:0000000001' -H 'token:dpOrtT03oo'

logs -> STDOUT can be piped to files, sent to docker, etc
