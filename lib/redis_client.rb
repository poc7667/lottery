require 'redis'
require 'json'
$i = 1
redis = Redis.new
begin
    data = {"time" => "#{ Time.now }" }
    redis.publish("messages.create", data.to_json)
    sleep 0.9
    p data
    $i +=1
end while $i > 0