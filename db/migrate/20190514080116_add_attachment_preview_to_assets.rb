class AddAttachmentPreviewToAssets < ActiveRecord::Migration[5.1]
  def self.up
    change_table :assets do |t|
      t.attachment :preview
    end
  end

  def self.down
    remove_attachment :assets, :preview
  end
end
