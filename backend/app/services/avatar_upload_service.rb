# frozen_string_literal: true
class AvatarUploadService
  def initialize(user, file = nil)
    @user = user
    @file = file
  end

  attr_reader :user, :file

  def call
    return unless file && file[:tempfile].present?

    destroy! if @user.avatar.present?

    data = file[:tempfile].read
    filename = File.basename(file[:tempfile].path)

    upload!(filename, data)

    @user.update!(avatar: url(filename))
  end

  def upload!(filename, data)
    filepath = storage_path(filename)
    filepath.prepend('/opt')
    FileUtils.mkdir_p(File.dirname(filepath))
    File.open(filepath, 'wb') do |file|
      file.write data
    end
  rescue => e
    raise e
  end

  def destroy!
    FileUtils.rm_rf(URI(user.avatar).path)
    user.avatar = nil
    user.save!
  end

  private

  def url(filename)
    "#{ENV.fetch('BACKEND_STORAGE_URL', '')}#{storage_path(filename)}"
  end

  def storage_path(filename)
    path = "/storage/#{salt}/#{filename}"
  end

  def salt
    Digest::MD5.hexdigest("#{user.id}_#{user.class.to_s.demodulize.downcase}")
  end
end
