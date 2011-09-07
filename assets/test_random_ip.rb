require 'redis'
count_per_minute = 200
wait_time = 60

begin

  redis = Redis.new

	file = File.new("wufoo.com_access.log-20100401", "r", :encoding => 'UTF-8')
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
        out = "pink-eye-p-#{time.min}"
        puts "writing #{matchdata[0]} to #{out}"
	      redis.sadd(out, matchdata[0])
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
  puts "#{line}, #{arr[0]}"
	err
end