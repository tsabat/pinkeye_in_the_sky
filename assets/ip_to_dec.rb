##by hand

str = "204.232.136.208"

arr = str.split('.')

puts arr

n = 16777216 * arr[0].to_i + 65536 * arr[1].to_i + 256 * arr[2].to_i + arr[3].to_i

n = (n - (n % 65536))

puts n

##with library

require 'ipaddr'
puts IPAddr.new(str).to_i


