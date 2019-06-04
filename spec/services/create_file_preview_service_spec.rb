# frozen_string_literal: true

require 'rails_helper'

describe CreateFilePreviewService do
  before do
    @service = CreateFilePreviewService.new(nil)
  end

  it 'should succeed when calling libreoffice directly' do
    expect(system(@service.libreoffice_path, '--version')).to eq(true)
  end
end
