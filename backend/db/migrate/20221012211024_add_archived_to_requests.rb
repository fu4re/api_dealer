class AddArchivedToRequests < ActiveRecord::Migration[7.1]
  def change
    add_column :requests, :archive, :boolean, default: false
  end
end
