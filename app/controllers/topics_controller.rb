class TopicsController < ApplicationController
	def new
		@session = Session.find(params[:session_id])
		topic = @session.topics.create(:votes => 0, :description => 'Enter description')
		render :file => "topics/show", :layout => false, :locals => {:topic => topic}
  
	end

	def remove_all
		session = Session.find(params[:session_id]).topics.destroy_all
	end
end
