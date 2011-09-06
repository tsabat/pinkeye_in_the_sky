#! /usr/local/bin/ruby
# encoding: utf-8

require 'redis'
require 'json'

counter = 1
begin
	file = File.new("ip_group_city.csv", "r", :encoding => 'UTF-8')
  redis = Redis.new
	while (line = file.gets)
    line.gsub! /"/u, ''
    line.chomp!
		arr = line.split(',')
    redis.set arr[0], {:latitude => arr[7], :longitude => arr[8]}.to_json
    counter = counter + 1
    if (counter % 10 == 0)
      puts "#{counter} items done! #{arr[0]} inserted."
    end
	end
	file.close
rescue => err
	puts "Exception: #{err}"
  puts "#{line}, #{arr[0]}"
	err
end
