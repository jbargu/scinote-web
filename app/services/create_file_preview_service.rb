# frozen_string_literal: true

class CreateFilePreviewService
  extend Service
  require 'open3'

  attr_reader :errors, :output_file_path

  def initialize(input_file_path)
    @input_file_path = input_file_path
    @errors = {}
  end

  def libreoffice_path
    ENV['LIBREOFFICE_PATH'] || 'libreoffice'
  end

  def call
    directory = File.dirname(@input_file_path)
    basename  = File.basename(@input_file_path, '.*')
    @output_file_path = File.join(directory, "#{basename}.png")

    cmd = [
      libreoffice_path,
      '--headless', '--invisible',
      '--convert-to', 'png',
      '--outdir', directory,
      @input_file_path
    ]

    Rails.logger.debug("Running: #{cmd.join(' ')}")
    stdout_and_stderr, status = Open3.capture2e(*cmd)
    Rails.logger.debug("Stdout/stderr message: #{stdout_and_stderr}, status: #{status}.")
    self
  rescue StandardError => e
    @errors[e.class.to_s.downcase.to_sym] = e.message
    self
  end

  def succeed?
    @errors.none?
  end
end
