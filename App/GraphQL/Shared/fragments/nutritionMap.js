import gql from 'graphql-tag'
import nutrient from './nutrient'

export default gql`
  fragment NutritionMap on NutritionMap {
    addedSugar { ... Nutrient }
    biotin { ... Nutrient }
    caffeine { ... Nutrient }
    calcium { ... Nutrient }
    calories { ... Nutrient }
    carbohydrates { ... Nutrient }
    chloride { ... Nutrient }
    cholesterol { ... Nutrient }
    choline { ... Nutrient }
    chromium { ... Nutrient }
    copper { ... Nutrient }
    fatCalories { ... Nutrient }
    fiber { ... Nutrient }
    folate { ... Nutrient }
    folicAcid { ... Nutrient }
    insolubleFiber { ... Nutrient }
    iodine { ... Nutrient }
    iron { ... Nutrient }
    magnesium { ... Nutrient }
    manganese { ... Nutrient }
    molybdenum { ... Nutrient }
    monounsaturatedFat { ... Nutrient }
    niacin { ... Nutrient }
    pantothenicAcid { ... Nutrient }
    phosphorus { ... Nutrient }
    polyunsaturatedFat { ... Nutrient }
    potassium { ... Nutrient }
    protein { ... Nutrient }
    riboflavin { ... Nutrient }
    saturatedFat { ... Nutrient }
    selenium { ... Nutrient }
    sodium { ... Nutrient }
    solubleFiber { ... Nutrient }
    sugar { ... Nutrient }
    sugarAlcohol { ... Nutrient }
    thiamin { ... Nutrient }
    totalFat { ... Nutrient }
    transFat { ... Nutrient }
    vitaminA { ... Nutrient }
    vitaminB12 { ... Nutrient }
    vitaminB6 { ... Nutrient }
    vitaminC { ... Nutrient }
    vitaminD { ... Nutrient }
    vitaminE { ... Nutrient }
    vitaminK { ... Nutrient }
    zinc { ... Nutrient }
  }
  ${nutrient}
`
