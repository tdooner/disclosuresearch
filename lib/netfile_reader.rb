require 'csv'

class NetfileReader
  include Enumerable

  def initialize(filename)
    @filename = filename
  end

  def csv
    @csv ||= begin
               file = nil

               if @filename.end_with?('.gz')
                 require 'open3'
                 _stdin, stdout, _stderr, _wait_thr = Open3.popen3("gunzip --stdout #{@filename}")
                 file = stdout
               else
                 file = File.open(@filename)
               end

               CSV.new(file, headers: :first_row)
             end
  end

  def each(&block)
    csv.each(&block)
  end

  def each_header(&block)
    csv.headers.each(&block)
  end
end
