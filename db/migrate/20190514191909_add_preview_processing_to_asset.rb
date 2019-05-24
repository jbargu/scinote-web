# frozen_string_literal: true

class AddPreviewProcessingToAsset < ActiveRecord::Migration[5.1]
  def self.up
    add_column :assets, :preview_processing, :boolean
  end

  def self.down
    remove_column :assets, :preview_processing
  end
end
