module MarketplaceHelper
  def rebuilded_marketplace_response(response)
    id = 0
    response['list'].flat_map do |company|
      company['models'].map do |model|
        title = "#{model['brand']['titleRus']} #{model['titleRus']}"
        title = "#{title} (#{model['ownTitle']})" if model['ownTitle'].present?
        id += 1

        {
          id: id,
          title: title,
          brand: model['brand']['titleRus'],
          logo: model['brand']['logo'],
          doors: model['bodies'][0]['doors'],
          type: model['bodies'][0]['title'],
          count: model['count'],
          price: model['minPrice'],
          model: model['titleRus'],
          photo: model['photo'],
          transport_type: model['transportType']['title']
        }
      end
    end
  end
end
