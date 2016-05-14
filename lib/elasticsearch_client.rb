class ElasticsearchClient
  def initialize(url = (ENV['ELASTICSEARCH_HOST'] || 'http://127.0.0.1:9200'))
    @url = URI(url)
  end

  def initialize_index
    with_connection do |http|
      puts http.request(Net::HTTP::Delete.new('/netfile')).inspect
      resp = http.request(Net::HTTP::Put.new('/netfile').tap do |req|
        req.body = JSON.generate(
          mappings: JSON.parse(File.read('mapping.json'))['mappings'],
          settings: {
            index: {
              number_of_shards: 1,
              number_of_replicas: 1,
            }
          }
        )
      end)
      puts resp.inspect
      puts resp.body
    end
  end

  def bulk_index(enumerator)
    with_connection do |http|
      enumerator.each_slice(1_000) do |rows|
        resp = http.request(
          Net::HTTP::Post.new("/_bulk").tap do |req|
            req.body = rows.flat_map do |row|
              [
                '{"index":{"_index":"netfile","_type":"contribution"}}',
                Hash[row.find_all { |k, v| !v.nil? && v != 'None' }].to_json
              ]
            end.join("\n") + "\n"
          end
        )
        puts resp.inspect
      end
    end
  end

  private

  def with_connection(&block)
    Net::HTTP.start(@url.host, @url.port, &block)
  end
end
