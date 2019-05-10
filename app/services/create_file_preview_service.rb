# frozen_string_literal: true

class CreateFilePreviewService
  extend Service

  CONTENT_TYPES = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', # .docx
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', # .pptx
    'application/vnd.ms-powerpoint', # .ppt
  ].freeze

  attr_reader :errors

  def initialize(input_file)
    # TODO: check content type, extend to  multiple files
    @input_file = input_file
    @errors = {}
  end

  def libreoffice_path
    'libreoffice'
  end

  def call
    directory = File.dirname(@input_file.path)
    basename  = File.basename(@input_file.path, '.*')
    png_file  = File.join(directory, "#{basename}.png")

    system libreoffice_path, '--headless',
      '--invisible', '--convert-to', 'png',
      '--outdir', directory,
      @input_file.path

    self
    # Paperclip.io_adapters.for(Asset.find(35).file)
    # CreateFilePreviewService.new(f).call
  end


  def succeed?
    @errors.none?
  end
end
