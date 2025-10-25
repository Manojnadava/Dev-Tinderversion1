Post /auth/signup
Post /auth/login
Post /auth/logout   these comes under auth Router where creating a group of similar api  routes so all the signup ,login and logout req starts with /auth


Get /profile/view/:userid -- ones own id
patch /profile/edit
patch /profile/forgot-password Comes under Profile routes

Status request a  another user or ignore a another user based on feed by a user

These 4 route api comes under Connection routes
post/request/send/intersedted/:userid  this is also send to server only
post  /request/send/ignored/:userid   //User sending to server

Now another user can send u a request  and u can reject it or accept it 

post /request/review/accepted/:userid
post /request/review/rejected/:userid   


These comes under Notification Routes 
get /user/connections                this is get method because we are retreving it from db
get /user/request_recevied           able to see request recevied from the other users
get /user/feed                        loading the users in home


A user send request to aother user by  clicking ptofile of him 
Url made e - connection/intereseted/:aother_userid?sender=user_id  this url data should be renderd in another user notifcation  by hi_notification

intereseted/:aother_userid?sender=user_id  this needs to be stored in new table connection table

user_id aother_userid status -intereseted/:aother_userid?sender=user_id

// another user can reject it or accept it so status values reject , accept , pending , ignored(by sender)
Connection Schema includes

sender_id recevier_id status all should be required 

if recevier rejected the request i.e intrest req then this schema will be updated based on sender user id and status set as rejectedso inovld Api URLS s are as below 

intereseted/:aother_userid?sender=user_id   - will send a conncetion reques to anothe r user where he can accept or reject it until then it will be in pending status 

ignored/:aother_userid?sender=user_id - will not send a connection request to another user but a connection record is created in connection table with ignored status but later a recievr can still send a connection reuest 

