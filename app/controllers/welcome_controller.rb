class WelcomeController < ApplicationController
  include ActionController::Live

  def index
  end
  
  def prizes
  end

  def winners
  end

  def donators
    @supervisors = Staff.unscoped.where(:is_supervior => true).order_by(:id.asc).to_a
  end
  def verify_prizes
  end

  def revert_taken_prize
  end

  def new_prizes_stream
    # http://ngauthier.com/2013/02/rails-4-sse-notify-listen.html
    begin
      response.headers.delete('Content-Length')
      response.headers['Cache-Control'] = 'no-cache'
      response.headers['Content-Type'] = 'text/event-stream'
      logger.info "New stream starting, connecting to redis"
      redis = Redis.new
      redis.subscribe('messages.create', 'heartbeat') do |on|
        on.message do |event, data|
          if event == 'messages.create'
            response.stream.write "event: #{event}\n"
            response.stream.write "data: #{data}\n\n"
          elsif event == 'heartbeat'
            response.stream.write("event: heartbeat\ndata: heartbeat\n\n")
          end
        end
      end
    rescue IOError
      logger.info "Stream closed"
    rescue ActionController::Live::ClientDisconnected
      logger.info "Client disconnected"
    ensure

      ap "close a live stream"
      redis.quit
      response.stream.close
    end
  end

  def check_prizes
    @prizes = Prize.winner_list.order_by("registered_at DESC")
  end

  private
    def sse(object, options = {})
      (options.map{|k,v| "#{k}: #{v}" } << "data: #{JSON.dump object}").join("\n") + "\n\n"
    end


end
