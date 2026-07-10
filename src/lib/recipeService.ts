import { db } from "./firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  query,
  orderBy 
} from "firebase/firestore";
import { Recipe, SEED_RECIPES } from "../types";

const RECIPES_COLLECTION = "recipes";

export const recipeService = {
  /**
   * Fetches all recipes from Firestore.
   * If the collection is empty, seeds it with the initial recipes.
   */
  async getRecipes(): Promise<Recipe[]> {
    const recipesCol = collection(db, RECIPES_COLLECTION);
    const q = query(recipesCol, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log("No recipes found in database. Seeding initial recipes...");
      const seeded: Recipe[] = [];
      // Seed initial recipes
      for (const recipe of SEED_RECIPES) {
        // We use the existing recipe's ID as the document ID to maintain consistency
        const docRef = doc(db, RECIPES_COLLECTION, recipe.id);
        await setDoc(docRef, recipe);
        seeded.push(recipe);
      }
      return seeded;
    }

    const recipes: Recipe[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      recipes.push({
        ...data,
        id: doc.id, // Ensure id matches doc ID
      } as Recipe);
    });
    return recipes;
  },

  /**
   * Adds a new recipe to Firestore.
   */
  async addRecipe(recipeData: Omit<Recipe, "id">): Promise<Recipe> {
    const cleanedData = { ...recipeData } as any;
    delete cleanedData.id;

    // Clean undefined fields to avoid Firestore errors
    Object.keys(cleanedData).forEach(key => {
      if (cleanedData[key] === undefined) {
        delete cleanedData[key];
      }
    });

    const recipesCol = collection(db, RECIPES_COLLECTION);
    const docRef = await addDoc(recipesCol, cleanedData);
    
    // Return the created recipe with the generated document ID
    return {
      ...cleanedData,
      id: docRef.id,
    } as Recipe;
  },

  /**
   * Updates an existing recipe in Firestore.
   */
  async updateRecipe(id: string, recipeData: Partial<Recipe>): Promise<void> {
    const cleanedData = { ...recipeData } as any;
    delete cleanedData.id;

    // Clean undefined fields to avoid Firestore errors
    Object.keys(cleanedData).forEach(key => {
      if (cleanedData[key] === undefined) {
        delete cleanedData[key];
      }
    });

    const docRef = doc(db, RECIPES_COLLECTION, id);
    await updateDoc(docRef, cleanedData);
  },

  /**
   * Deletes a recipe from Firestore.
   */
  async deleteRecipe(id: string): Promise<void> {
    const docRef = doc(db, RECIPES_COLLECTION, id);
    await deleteDoc(docRef);
  }
};
