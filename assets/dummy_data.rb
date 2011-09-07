require 'redis'
require 'json'

redis = Redis.new

r = redis.smembers "pink-eye-p-36"

arr = []

str = '{"coordinates":['
r.each do |line|
  if line != ''
    str = str + line + ','
  end

end

str = str.chop! + ']}'

puts str
