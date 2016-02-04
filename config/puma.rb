APP_NAME = "vvtk_lottery"
app_path = File.expand_path('../', File.dirname(__FILE__))
pidfile "/tmp/puma.#{APP_NAME}.pid"
bind "unix:///tmp/puma.#{APP_NAME}.sock"
stdout_redirect "/tmp/puma.stdout.#{APP_NAME}.log", "/tmp/puma.stderr.#{APP_NAME}.log", true
workers Integer(ENV['WEB_CONCURRENCY'] || 1)
threads 1, 5
preload_app!

rackup      DefaultRackup
port        ENV['PORT']     || 7667
rails_env = ENV['RAILS_ENV'] || "production"
environment rails_env

activate_control_app
