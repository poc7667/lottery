# INSTALL

How to import the data source(staff, prize)

- rake import:prize                  
- rake import:staff

## About data source 

You should put the excel files under **lib/tasks/data_source**

with the same format naming rule

	donator_2014.xls  
	employee_2014.xls 
	prizes_2014.xls

## Available APIs

### Current server's host is `http://cloud-test:4001`


### Routes

	               Prefix Verb URI Pattern                                    Controller#Action
	        welcome_prizes GET  /welcome/prizes(.:format)                      welcome#prizes
	       welcome_winners GET  /welcome/winners(.:format)                     welcome#winners
	      welcome_donators GET  /welcome/donators(.:format)                    welcome#donators
	       dashboard_index GET  /dashboard/index(.:format)                     dashboard#index
	 dashboard_show_prizes GET  /dashboard/show_prizes(.:format)               dashboard#show_prizes
	 dashboard_show_staffs GET  /dashboard/show_staffs(.:format)               dashboard#show_staffs
	           query_index GET  /query/index(.:format)                         query#index
	          query_staffs GET  /query/staffs(.:format)                        query#staffs
	                       GET  /query/staff/:id(.:format)                     query#staff
	       query_slideshow GET  /query/slideshow(.:format)                     query#slideshow
	         query_summary GET  /query/summary(.:format)                       query#summary
	          query_prizes GET  /query/prizes(.:format)                        query#prizes
	                       GET  /query/prize/:id(.:format)                     query#prize
	     query_winner_list GET  /query/winner_list(.:format)                   query#winner_list
	query_remaining_prizes GET  /query/remaining_prizes(.:format)              query#remaining_prizes
	                            /register/:prize_id/:full_staff_id(.:format)   query#register
	                            /unregister/:prize_id/:full_staff_id(.:format) query#unregister
	                            /take/:prize_id/:full_staff_id(.:format)       query#take
	                  root GET  /                                              welcome#index