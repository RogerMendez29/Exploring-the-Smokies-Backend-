class SavedTrail < ApplicationRecord
    belongs_to: :user 
      belongs_to: :trail 
       
end
