# frozen_string_literal: true

module ProtocolImporters
  class TablesBuilder
    def self.extract_tables_from_html_string(description_string, remove_first_column_row = false)
      tables = []

      doc = Nokogiri::HTML(description_string)
      tables_nodeset = doc.css('table')

      tables_nodeset.each do |table_node|
        rows_nodeset = table_node.css('tr')

        two_d_array = Array.new(rows_nodeset.count) { [] }

        rows_nodeset.each_with_index do |row, i|
          row.css('td').each_with_index do |cell, j|
            two_d_array[i][j] = cell.inner_html
          end
          two_d_array[i].shift if remove_first_column_row
        end
        two_d_array.shift if remove_first_column_row

        tables << Table.new(contents: { data: two_d_array }.to_json)
      end
      tables
    end
  end
end
