Post /auth/signup
Post /auth/login
Post /auth/logout   these comes under auth Router where creating a group of similar api  routes so all the signup ,login and logout req starts with /auth


Get /profile/view/:userid -- ones own id
patch /profile/edit
patch /profile/forgot-password Comes under Profile routes

Status request a  another user or ignore a another user based on feed by a user

These 4 route api comes under Connection routes
post/request/send/intersedted/:userid  
post  /request/send/ignored/:userid   //User sending to server

Now another user can send u a request  and u can reject it or accept it 

post /request/review/accepted/:userid
post /request/review/rejected/:userid   


These comes under Notification Routes 
get /user/connections                this is get method because we are retreving it from db
get /user/request_recevied           able to see request recevied from the other users
get /user/feed                        loading the users in home