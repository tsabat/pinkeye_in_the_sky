require 'redis'
require 'ipaddr'
require 'json'


count_per_minute = 600
wait_time = 60

def get_ip ip
  n = IPAddr.new(ip).to_i
  (n - (n % 65536))
end

def coordinates redis, num
  r = redis.get "pinkeye#{num}"
  if !r.nil?
    arr = r.split(",");
    {:latitude => arr[0], :longitude => arr[1]}.to_json
  else
    r
  end

end

begin

  redis = Redis.new

	file = File.new("logs", "r", :encoding => 'UTF-8')
  count = 0

	while (line = file.gets)
    time = Time.now

    regex = Regexp.new(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/)
    matchdata = regex.match(line)
    if matchdata
      if count > count_per_minute
        puts "sleeping #{wait_time} seconds. current count: #{count}. count per min: #{count_per_minute}"
        sleep wait_time
        count = 0
      else
        json = coordinates redis, get_ip(matchdata[0])
        if json.nil?
          puts 'skipping string'
        else
          key = "pink-eye-p-#{time.min}"
          puts "writing #{json} \nto key: #{key}"
          puts "count: #{count}"
	        redis.sadd(key, json)
        end

      end
    end

    count = count + 1

    if (count % 30 == 0)
      "#{count} items added to redis."
    end
  end

	file.close
  redis.quit

rescue => err
	puts "Exception: #{err}"
  puts "#{line}"
	err
end

