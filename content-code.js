/* content-code.js
   Code walkthrough steps. Code lines are copied exactly from the notebook
   (fda_a3_26634079_colab_1.ipynb). Cell numbers count from 0 at the top of the notebook.
   '# ...' marks lines that were skipped. Each line may have a note "n" for "Line by line".
   The code was copied by a script and checked line by line against the notebook. If you edit, keep the code identical to the notebook. */
var CONTENT = window.CONTENT || (window.CONTENT = {});
CONTENT.code = [
 {
  "id": "setup",
  "title": "Setup: fixed seed and pandas output",
  "cells": [
   2
  ],
  "section": "0. Setup",
  "lines": [
   {
    "c": "from sklearn import set_config",
    "n": "Brings in scikit-learn's global settings tool."
   },
   {
    "c": "# ..."
   },
   {
    "c": "import warnings",
    "n": "Loads Python's warnings module."
   },
   {
    "c": "warnings.filterwarnings('ignore')",
    "n": "Hides warning messages so the output stays easy to read."
   },
   {
    "c": "set_config(transform_output='pandas')   # keep column names inside pipelines",
    "n": "Makes every scikit-learn step return a table with column names, not a bare array."
   },
   {
    "c": ""
   },
   {
    "c": "SEED = 42                               # same seed everywhere so results can be repeated",
    "n": "Stores one fixed random seed. It is passed to every split, fold and model."
   }
  ],
  "plain": [
   "This cell loads the tools and sets two things used everywhere: steps keep column names, and one fixed random seed controls all randomness."
  ],
  "say": [
   "Fixed seed everywhere, so every result can be repeated exactly."
  ],
  "output": [
   "No printed output. Point at `SEED = 42`."
  ],
  "lesson": "split"
 },
 {
  "id": "checkpoint",
  "title": "Drive and checkpoint: saving every slow step",
  "cells": [
   4
  ],
  "section": "Save folder",
  "lines": [
   {
    "c": "from google.colab import drive",
    "n": "Loads Colab's Google Drive helper."
   },
   {
    "c": "drive.mount('/content/drive')",
    "n": "Connects Google Drive, so files survive a disconnect."
   },
   {
    "c": "# ..."
   },
   {
    "c": "def checkpoint(name, make):",
    "n": "Defines checkpoint: it takes a name and a function called make that does the slow work."
   },
   {
    "c": "    \"\"\"Load a saved result if it exists. Otherwise run make(), save the result and return it.\"\"\"",
    "n": "A short description of what the function does."
   },
   {
    "c": "    path = f'{SAVE_DIR}/{name}.joblib'",
    "n": "Builds the file path where this result is saved."
   },
   {
    "c": "    if os.path.exists(path):",
    "n": "Checks whether a saved file already exists."
   },
   {
    "c": "        print(f'[loaded saved result: {name}]')",
    "n": "If it does, prints a message saying it was loaded."
   },
   {
    "c": "        return joblib.load(path)",
    "n": "Loads the saved result and returns it straight away."
   },
   {
    "c": "    result = make()",
    "n": "Otherwise, runs the slow step."
   },
   {
    "c": "    joblib.dump(result, path, compress=3)",
    "n": "Saves the result to Drive, compressed."
   },
   {
    "c": "    return result",
    "n": "Returns the new result."
   }
  ],
  "plain": [
   "`checkpoint` either loads a saved result or runs the step and saves it. The code and results are the same either way."
  ],
  "say": [
   "Colab kept disconnecting, so every slow step is saved to Drive and reloaded on a rerun. It does not change any result."
  ],
  "output": [
   "In later cells, lines like `[loaded saved result: search_k-NN]` show a step was reloaded."
  ],
  "lesson": "saved-results"
 },
 {
  "id": "datacheck",
  "title": "Data check: missing, duplicates, balance",
  "cells": [
   8
  ],
  "section": "1. The data mining problem and data check",
  "lines": [
   {
    "c": "print('Missing values:', data.isna().sum().sum())",
    "n": "Counts missing values across the whole table."
   },
   {
    "c": "print('Duplicate rows (ignoring pid):', data.drop(columns='pid').duplicated().sum())",
    "n": "Counts duplicate rows, ignoring the pid column."
   },
   {
    "c": "print(data['Diabetes_binary'].value_counts())",
    "n": "Counts how many rows are in each class of the target."
   }
  ],
  "plain": [
   "Three quick checks on the raw data before any modelling."
  ],
  "say": [
   "No missing values, 1,365 duplicates I kept, classes exactly 50/50."
  ],
  "output": [
   "`Missing values: 0`",
   "`Duplicate rows (ignoring pid): 1365`",
   "31811 rows for class 1 and 31811 for class 0."
  ],
  "lesson": "data"
 },
 {
  "id": "pidleak",
  "title": "The pid leak",
  "cells": [
   10
  ],
  "section": "1.1 pid gives away the answer",
  "lines": [
   {
    "c": "pid_bands = pd.cut(data['pid'], 20)",
    "n": "Cuts pid into 20 equal-width bands."
   },
   {
    "c": "rate = data.groupby(pid_bands, observed=True)['Diabetes_binary'].mean()",
    "n": "Works out the share with diabetes in each band."
   },
   {
    "c": "# ..."
   },
   {
    "c": "cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=SEED)",
    "n": "Sets up stratified 5-fold cross-validation. The same cv is reused for every model later."
   },
   {
    "c": "leak = cross_val_score(DecisionTreeClassifier(max_depth=1), data[['pid']], data['Diabetes_binary'],",
    "n": "Scores a decision tree with only one split, using pid as its only input."
   },
   {
    "c": "                       cv=cv, scoring='roc_auc')",
    "n": "Continues the line above: same folds, scored by ROC AUC."
   },
   {
    "c": "print('AUC using only pid:', round(leak.mean(), 4))",
    "n": "Prints the average AUC, rounded to 4 decimals."
   }
  ],
  "plain": [
   "The plot shows the diabetes rate for each pid band. The one-split tree tests whether pid alone predicts the label."
  ],
  "say": [
   "The rate jumps from 0 to 1, and one split on pid gives AUC 1.0. That is target leakage, so I drop pid."
  ],
  "output": [
   "The plot jumping from 0 to 1 at the middle band.",
   "`AUC using only pid: 1.0`"
  ],
  "lesson": "pid-leak"
 },
 {
  "id": "clean",
  "title": "Clean: drop pid, Sex to 0/1",
  "cells": [
   12
  ],
  "section": "1.2 Clean the data",
  "lines": [
   {
    "c": "X = data.drop(columns=['pid', 'Diabetes_binary'])",
    "n": "Makes the inputs X by removing pid and the target."
   },
   {
    "c": "X['Sex'] = (X['Sex'].str.lower() == 'male').astype(int)",
    "n": "Turns Sex into one column: 1 if male, 0 otherwise."
   },
   {
    "c": "y = data['Diabetes_binary']",
    "n": "Keeps the target in y."
   }
  ],
  "plain": [
   "The inputs and the target are separated, the leaking ID is removed, and the only text column becomes 0/1."
  ],
  "say": [
   "Binarisation: two values only need one 0/1 column."
  ],
  "output": [
   "No printed output. Point at the Sex line."
  ],
  "lesson": "cleaning"
 },
 {
  "id": "split",
  "title": "Split: 80% development, 20% test",
  "cells": [
   14
  ],
  "section": "2. Split the data",
  "lines": [
   {
    "c": "X_dev, X_test, y_dev, y_test = train_test_split(X, y, test_size=0.20, stratify=y, random_state=SEED)",
    "n": "Splits once: 20% test, stratified by the target, with the fixed seed."
   },
   {
    "c": "print('Development set:', X_dev.shape)",
    "n": "Prints the shape of the development set."
   },
   {
    "c": "print('Test set:', X_test.shape)",
    "n": "Prints the shape of the test set."
   }
  ],
  "plain": [
   "The test set is put aside here and not touched again until Section 6."
  ],
  "say": [
   "Stratify keeps the 50/50 balance in both parts. The test set is touched only once, in Section 6."
  ],
  "output": [
   "`Development set: (50897, 21)`",
   "`Test set: (12725, 21)`"
  ],
  "lesson": "split"
 },
 {
  "id": "addfeatures",
  "title": "Features: add_features",
  "cells": [
   16
  ],
  "section": "3. Pre-processing and new features",
  "lines": [
   {
    "c": "def add_features(df):",
    "n": "Defines a function that adds the new features to a table."
   },
   {
    "c": "    df = df.copy()",
    "n": "Works on a copy, so the original table is not changed."
   },
   {
    "c": "    df['BMI_clip'] = df['BMI'].clip(upper=60)                         # cap very high BMI",
    "n": "BMI_clip: BMI capped at 60."
   },
   {
    "c": "    df['BMI_cat'] = pd.cut(df['BMI'], [0, 18.5, 25, 30, 35, 40, 1000],  # WHO BMI bands",
    "n": "BMI_cat: puts BMI into the WHO bands, coded 0 to 5."
   },
   {
    "c": "                           labels=False, right=False).astype(int)",
    "n": "Continues the line above: band numbers, not labels."
   },
   {
    "c": "    df['CardioCount'] = df['HighBP'] + df['HighChol'] + df['HeartDiseaseorAttack'] + df['Stroke']",
    "n": "CardioCount: adds four heart and metabolic flags."
   },
   {
    "c": "    df['BP_Chol'] = df['HighBP'] * df['HighChol']",
    "n": "BP_Chol: 1 only when both HighBP and HighChol are 1."
   },
   {
    "c": "    df['Age_BMI'] = df['Age'] * df['BMI_clip']",
    "n": "Age_BMI: age code times capped BMI."
   },
   {
    "c": "    df['Lifestyle'] = df['PhysActivity'] + df['Fruits'] + df['Veggies'] - df['Smoker'] - df['HvyAlcoholConsump']",
    "n": "Lifestyle: three good habits added, two bad habits taken away."
   },
   {
    "c": "    df['FreqPhysDistress'] = (df['PhysHlth'] >= 14).astype(int)",
    "n": "FreqPhysDistress: 1 if PhysHlth is 14 days or more."
   },
   {
    "c": "    df['FreqMentDistress'] = (df['MentHlth'] >= 14).astype(int)",
    "n": "FreqMentDistress: 1 if MentHlth is 14 days or more."
   },
   {
    "c": "    df['PoorHealth'] = (df['GenHlth'] >= 4).astype(int)",
    "n": "PoorHealth: 1 if GenHlth is 4 or 5."
   }
  ],
  "plain": [
   "Every new feature uses only the values in its own row, so it is safe inside a pipeline. The function then drops the original BMI, because BMI_clip replaces it."
  ],
  "say": [
   "Row-wise features, so they are safe in a pipeline. BMI capped at 60, WHO bands, interactions like HighBP × HighChol from my AT2 finding."
  ],
  "output": [
   "No printed output. Point at the BMI_clip and BP_Chol lines."
  ],
  "lesson": "features"
 },
 {
  "id": "onehot",
  "title": "Features: one_hot and dummy_columns",
  "cells": [
   16
  ],
  "section": "3. Pre-processing and new features",
  "lines": [
   {
    "c": "def one_hot(df):",
    "n": "Defines the one-hot encoding function."
   },
   {
    "c": "    # one-hot encode the ordinal codes (dummy columns come first)",
    "n": "A comment: the new 0/1 columns are placed first."
   },
   {
    "c": "    levels = {'GenHlth': range(1, 6), 'Age': range(1, 14), 'Income': range(1, 9),",
    "n": "Lists every possible level for each ordinal code."
   },
   {
    "c": "              'Education': range(1, 7), 'BMI_cat': range(0, 6)}",
    "n": "Continues the list: Education and BMI_cat."
   },
   {
    "c": "    parts = []",
    "n": "Starts an empty list for the new columns."
   },
   {
    "c": "    for col, values in levels.items():",
    "n": "Loops over each ordinal column and its levels."
   },
   {
    "c": "        cat = pd.Categorical(df[col], categories=list(values))",
    "n": "Fixes the categories, so every level gets a column even if it is rare."
   },
   {
    "c": "        parts.append(pd.get_dummies(cat, prefix=col, dtype=float).set_index(df.index))",
    "n": "Makes one 0/1 column per level, keeping the row order."
   },
   {
    "c": "    return pd.concat(parts + [df.drop(columns=list(levels))], axis=1)",
    "n": "Joins the new 0/1 columns with the rest, dropping the original codes."
   },
   {
    "c": "def dummy_columns(df):",
    "n": "Defines a helper that finds the one-hot columns."
   },
   {
    "c": "    # the one-hot columns end with a number, e.g. Age_3",
    "n": "A comment: one-hot column names end with a number."
   },
   {
    "c": "    return [c for c in df.columns if c.split('_')[-1].isdigit()]",
    "n": "Returns every column whose name ends in a number, such as Age_3."
   }
  ],
  "plain": [
   "`one_hot` turns each ordinal code into separate 0/1 columns. `dummy_columns` finds those columns later, so they can be left unscaled."
  ],
  "say": [
   "One-hot gives each band its own weight. It is used only for the linear models, in feature set F2."
  ],
  "output": [
   "No printed output. Point at the `levels` dictionary."
  ],
  "lesson": "one-hot"
 },
 {
  "id": "mi",
  "title": "Mutual information (filter method)",
  "cells": [
   18
  ],
  "section": "3. Feature sets",
  "lines": [
   {
    "c": "mi = mutual_info_classif(add_features(X_dev), y_dev, random_state=SEED)",
    "n": "Scores each feature against the target on the development set, with the new features added."
   },
   {
    "c": "mi = pd.Series(mi, index=add_features(X_dev).columns).sort_values()",
    "n": "Puts the scores in a labelled list, sorted from lowest to highest."
   },
   {
    "c": "low_mi = list(mi[mi < 0.005].index)",
    "n": "Keeps the names of features scoring below 0.005."
   },
   {
    "c": "print('Low mutual information features (dropped in F3):', low_mi)",
    "n": "Prints those low-scoring feature names."
   }
  ],
  "plain": [
   "Each feature is scored alone. The lowest scorers are the ones F3 removes."
  ],
  "say": [
   "A filter method that scores each feature alone. Five scored below 0.005, and those are dropped in F3."
  ],
  "output": [
   "`Low mutual information features (dropped in F3): ['NoDocbcCost', 'FreqMentDistress', 'HvyAlcoholConsump', 'MentHlth', 'AnyHealthcare']`"
  ],
  "lesson": "mutual-info"
 },
 {
  "id": "stepsfor",
  "title": "Pipelines: steps_for",
  "cells": [
   19
  ],
  "section": "3. Feature sets",
  "lines": [
   {
    "c": "def steps_for(feature_set, scale):",
    "n": "Defines a function that builds the preprocessing steps for one feature set."
   },
   {
    "c": "# ..."
   },
   {
    "c": "    if feature_set == 'F2':",
    "n": "If the feature set is F2..."
   },
   {
    "c": "        steps.append(('one_hot', FunctionTransformer(one_hot)))",
    "n": "...add the one-hot encoding step."
   },
   {
    "c": "        if scale:",
    "n": "If this model needs scaling..."
   },
   {
    "c": "            steps.append(('scale', ColumnTransformer(",
    "n": "...use a ColumnTransformer to treat columns differently:"
   },
   {
    "c": "                [('keep', 'passthrough', dummy_columns)],",
    "n": "the 0/1 dummy columns pass through unchanged,"
   },
   {
    "c": "                remainder=StandardScaler(), verbose_feature_names_out=False)))",
    "n": "and every other column gets z-score scaling."
   },
   {
    "c": "    elif scale:",
    "n": "For the other feature sets, if the model needs scaling..."
   },
   {
    "c": "        steps.append(('scale', StandardScaler()))      # z-score scaling",
    "n": "...add a plain z-score scaler."
   },
   {
    "c": "    return steps",
    "n": "Returns the list of steps, ready to go inside a pipeline."
   }
  ],
  "plain": [
   "These steps go inside each model's pipeline, so they are fitted on the training part of each fold only. The skipped lines add `add_features` (F1 to F3) and drop the low-MI features (F3)."
  ],
  "say": [
   "This builds the preprocessing per feature set. scale=True adds a StandardScaler for k-NN, linear models, MLP and SVM. The 0/1 dummy columns are left unscaled."
  ],
  "output": [
   "No printed output. Point at `passthrough` and `StandardScaler()`."
  ],
  "lesson": "pipelines"
 },
 {
  "id": "featuresets",
  "title": "Comparing the 4 feature sets",
  "cells": [
   21
  ],
  "section": "3. Feature sets",
  "lines": [
   {
    "c": "# ..."
   },
   {
    "c": "def compare_feature_sets():",
    "n": "Defines a function that compares the feature sets."
   },
   {
    "c": "    rows = []",
    "n": "Starts an empty list of results."
   },
   {
    "c": "    for fs in ['F0', 'F1', 'F2', 'F3']:",
    "n": "Loops over the four feature sets."
   },
   {
    "c": "        for name, (model, scale) in test_models.items():",
    "n": "Loops over the four quick test models."
   },
   {
    "c": "            pipe = Pipeline(steps_for(fs, scale) + [('model', model)])",
    "n": "Builds a pipeline: preprocessing steps, then the model."
   },
   {
    "c": "            scores = cross_val_score(pipe, X_dev, y_dev, cv=cv, scoring='roc_auc', n_jobs=-1)",
    "n": "Scores it with the same 5 folds and ROC AUC."
   },
   {
    "c": "            rows.append([fs, name, scores.mean()])",
    "n": "Saves the feature set, model name and mean AUC."
   },
   {
    "c": "    return pd.DataFrame(rows, columns=['feature_set', 'model', 'cv_auc'])",
    "n": "Returns all results as a table."
   },
   {
    "c": ""
   },
   {
    "c": "fs_results = checkpoint('feature_sets', compare_feature_sets)",
    "n": "Runs the comparison, or loads it if it was saved."
   },
   {
    "c": "fs_table = fs_results.pivot(index='model', columns='feature_set', values='cv_auc').round(4)",
    "n": "Rearranges the results: one row per model, one column per feature set."
   }
  ],
  "plain": [
   "Four quick models are tried on each of the four feature sets, with the same folds, so the feature sets can be compared fairly."
  ],
  "say": [
   "Same 5 folds for all. Linear models are best with F2, trees and k-NN with F1. F3 hurt boosting, so I dropped that idea."
  ],
  "output": [
   "The table: logistic regression 0.8230 / 0.8244 / 0.8261 / 0.8244 and k-NN 0.8118 / 0.8157 / 0.8141 / 0.8154 for F0 to F3."
  ],
  "lesson": "feature-sets"
 },
 {
  "id": "tune",
  "title": "tune(): one function for every model",
  "cells": [
   26
  ],
  "section": "4. Tune one model for each method",
  "lines": [
   {
    "c": "def tune(name, pipe, settings, random_search=False, n_iter=20, X=X_dev, y=y_dev, train_score=True):",
    "n": "Defines tune: a name, a pipeline, the settings to try, and options."
   },
   {
    "c": "# ..."
   },
   {
    "c": "        if random_search:",
    "n": "If random search is chosen..."
   },
   {
    "c": "            search = RandomizedSearchCV(pipe, settings, n_iter=n_iter, cv=cv, scoring='roc_auc',",
    "n": "...try n_iter random settings with the same folds and ROC AUC..."
   },
   {
    "c": "                                        n_jobs=-1, random_state=SEED, return_train_score=train_score)",
    "n": "...using all processors, the fixed seed, and also recording training scores."
   },
   {
    "c": "        else:",
    "n": "Otherwise..."
   },
   {
    "c": "            search = GridSearchCV(pipe, settings, cv=cv, scoring='roc_auc',",
    "n": "...try every setting in a grid, with the same folds and ROC AUC..."
   },
   {
    "c": "                                  n_jobs=-1, return_train_score=train_score)",
    "n": "...also recording training scores."
   },
   {
    "c": "# ..."
   },
   {
    "c": "    search = checkpoint('search_' + name.replace(' ', '_'), run_search)",
    "n": "Runs the search, or loads it if it was saved."
   },
   {
    "c": "    i = search.best_index_",
    "n": "Finds the position of the best setting."
   },
   {
    "c": "    train_auc = search.cv_results_['mean_train_score'][i] if train_score else np.nan",
    "n": "Reads the training AUC of the best setting, to compare with validation."
   }
  ],
  "plain": [
   "Every model goes through this one function, so every model is tuned and scored the same way."
  ],
  "say": [
   "One function for every model: same folds, same metric. It records the CV AUC, its spread and the training AUC so I can see overfitting."
  ],
  "output": [
   "Each later model prints a line like `Decision tree: CV AUC 0.8158 (+/- 0.0030)`."
  ],
  "lesson": "tune-fn"
 },
 {
  "id": "tree",
  "title": "Decision tree and the depth curve",
  "cells": [
   30,
   31
  ],
  "section": "Decision tree (Week 7)",
  "lines": [
   {
    "c": "tree = Pipeline(steps_for(TREE_FS, False) + [('model', DecisionTreeClassifier(random_state=SEED))])",
    "n": "Builds the tree pipeline on feature set F1, with no scaling."
   },
   {
    "c": "tune('Decision tree', tree, {'model__criterion': ['gini', 'entropy'],",
    "n": "Tunes it, trying both purity measures..."
   },
   {
    "c": "                             'model__max_depth': [4, 6, 8, 10, 12, 16, None],",
    "n": "...seven depths, including no limit..."
   },
   {
    "c": "                             'model__min_samples_leaf': [1, 20, 50, 100, 200]})",
    "n": "...and five minimum leaf sizes: 70 combinations in all."
   },
   {
    "c": "# ..."
   },
   {
    "c": "# How depth affects training and validation AUC (bias-variance trade-off)",
    "n": "A comment: this cell shows the bias-variance trade-off."
   },
   {
    "c": "depths = [2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20, 25]",
    "n": "The depths to test."
   },
   {
    "c": "train_auc, val_auc = checkpoint('tree_depth_curve', lambda: validation_curve(",
    "n": "Scores the tree at each depth, on training and validation folds..."
   },
   {
    "c": "    tree, X_dev, y_dev, param_name='model__max_depth', param_range=depths,",
    "n": "...changing only max_depth..."
   },
   {
    "c": "    cv=cv, scoring='roc_auc', n_jobs=-1))",
    "n": "...with the same folds and ROC AUC."
   }
  ],
  "plain": [
   "The grid search finds the best tree. The depth curve then shows what happens as the tree gets deeper."
  ],
  "say": [
   "70 combinations. The depth curve shows the bias-variance trade-off."
  ],
  "output": [
   "`best settings: criterion entropy, max_depth 8, min_samples_leaf 200`",
   "The plot: validation peaks around depth 7, then falls while training rises to 1.0."
  ],
  "lesson": "bias-variance"
 },
 {
  "id": "knn",
  "title": "k-NN",
  "cells": [
   33
  ],
  "section": "k-nearest neighbours (Week 8)",
  "lines": [
   {
    "c": "knn = Pipeline(steps_for(TREE_FS, True) + [('model', KNeighborsClassifier(algorithm='brute'))])",
    "n": "Builds the k-NN pipeline on F1, with scaling."
   },
   {
    "c": "tune('k-NN', knn, {'model__n_neighbors': [25, 51, 101, 201, 301],",
    "n": "Tunes the number of neighbours k..."
   },
   {
    "c": "                   'model__weights': ['uniform', 'distance'],",
    "n": "...equal or distance-based weights..."
   },
   {
    "c": "                   'model__metric': ['euclidean', 'manhattan']}, train_score=False)",
    "n": "...and Euclidean or Manhattan distance. No training score: each point is its own neighbour."
   }
  ],
  "plain": [
   "k-NN needs scaled inputs, because it measures distance."
  ],
  "say": [
   "Best is k = 201 with Manhattan distance. Many 0/1 ties need a big neighbourhood."
  ],
  "output": [
   "`k-NN: CV AUC 0.8203 (+/- 0.0025)`",
   "best: manhattan, n_neighbors 201, uniform"
  ],
  "lesson": "knn"
 },
 {
  "id": "logreg",
  "title": "Logistic regression",
  "cells": [
   36
  ],
  "section": "Logistic regression (Week 9)",
  "lines": [
   {
    "c": "logreg = Pipeline(steps_for(LINEAR_FS, True) + [('model', LogisticRegression(solver='liblinear', max_iter=5000))])",
    "n": "Builds the logistic regression pipeline on F2, with scaling."
   },
   {
    "c": "tune('Logistic regression', logreg, {'model__C': [0.001, 0.01, 0.1, 1, 10],",
    "n": "Tunes C, from very strong to weak regularisation..."
   },
   {
    "c": "                                     'model__penalty': ['l1', 'l2']})",
    "n": "...and the penalty type, L1 or L2."
   }
  ],
  "plain": [
   "A small grid of 10 settings for the linear classifier."
  ],
  "say": [
   "C = 0.01, strong L2 regularisation."
  ],
  "output": [
   "`Logistic regression: CV AUC 0.8264 (+/- 0.0036)`",
   "best: C 0.01, penalty l2"
  ],
  "lesson": "logreg"
 },
 {
  "id": "mlp",
  "title": "MLP",
  "cells": [
   38
  ],
  "section": "Multi-layer perceptron (Week 9)",
  "lines": [
   {
    "c": "mlp = Pipeline(steps_for(LINEAR_FS, True) + [('model', MLPClassifier(early_stopping=True, max_iter=300, random_state=SEED))])",
    "n": "Builds the MLP pipeline on F2, with scaling and early stopping."
   },
   {
    "c": "tune('MLP', mlp, {'model__hidden_layer_sizes': [(8,), (16,), (32,), (64,), (32, 16), (64, 32)],",
    "n": "Network shapes to try: one or two hidden layers of different sizes."
   },
   {
    "c": "                  'model__alpha': loguniform(1e-5, 1e-1),",
    "n": "alpha (the L2 penalty) drawn from a log scale."
   },
   {
    "c": "                  'model__learning_rate_init': loguniform(3e-4, 1e-2),",
    "n": "Starting step size drawn from a log scale."
   },
   {
    "c": "                  'model__activation': ['relu', 'tanh']}, random_search=True, n_iter=16)",
    "n": "relu or tanh, with random search over 16 settings."
   }
  ],
  "plain": [
   "Random search, because there are many settings and some are continuous."
  ],
  "say": [
   "Random search over 16 settings. Best is one layer of 64 tanh neurons."
  ],
  "output": [
   "`MLP: CV AUC 0.8270 (+/- 0.0026)`",
   "best: tanh, alpha 0.062, hidden_layer_sizes (64,)"
  ],
  "lesson": "mlp"
 },
 {
  "id": "svm",
  "title": "SVM and the sample trap",
  "cells": [
   40,
   41
  ],
  "section": "Support vector machine (Week 10)",
  "lines": [
   {
    "c": "X_small, _, y_small, _ = train_test_split(X_dev, y_dev, train_size=10000, stratify=y_dev, random_state=SEED)",
    "n": "Takes a stratified sample of 10,000 development rows."
   },
   {
    "c": "svm = Pipeline(steps_for(LINEAR_FS, True) + [('model', SVC(random_state=SEED))])",
    "n": "Builds the SVM pipeline on F2, with scaling."
   },
   {
    "c": "tune('SVM', svm, [{'model__kernel': ['linear'], 'model__C': [0.01, 0.1, 1]},",
    "n": "Tries a linear kernel with three C values..."
   },
   {
    "c": "                  {'model__kernel': ['rbf'], 'model__C': [0.3, 1, 3], 'model__gamma': [0.003, 0.01, 0.03]}],",
    "n": "...and an RBF kernel with three C and three gamma values."
   },
   {
    "c": "     X=X_small, y=y_small)",
    "n": "Searches on the sample only, for speed."
   },
   {
    "c": "# ..."
   },
   {
    "c": "full_scores = checkpoint('svm_full_cv', lambda: cross_val_score(",
    "n": "Re-scores the best SVM..."
   },
   {
    "c": "    searches['SVM'].best_estimator_, X_dev, y_dev, cv=cv, scoring='roc_auc', n_jobs=-1))",
    "n": "...on the full development set, with the same folds."
   },
   {
    "c": "print(f'SVM on the 10,000 sample: {results[-1][\"cv_auc\"]:.4f}')",
    "n": "Prints the sample score."
   },
   {
    "c": "print(f'SVM on the full development set: {full_scores.mean():.4f}')",
    "n": "Prints the full-data score."
   }
  ],
  "plain": [
   "The search is done on a sample because kernel SVMs are slow. The winner is then re-scored on all development rows, for a fair comparison."
  ],
  "say": [
   "Searched on a sample for speed, then re-scored on full data: 0.832 dropped to 0.826."
  ],
  "output": [
   "`SVM on the 10,000 sample: 0.8323`",
   "`SVM on the full development set: 0.8256`"
  ],
  "lesson": "svm-trap"
 },
 {
  "id": "bagforest",
  "title": "Ensembles: bagging and random forest",
  "cells": [
   43,
   44
  ],
  "section": "Bagging, random forest and gradient boosting (Week 11)",
  "lines": [
   {
    "c": "bagging = Pipeline(steps_for(TREE_FS, False) + [('model', BaggingClassifier(",
    "n": "Builds the bagging pipeline on F1..."
   },
   {
    "c": "    DecisionTreeClassifier(random_state=SEED), n_estimators=50, random_state=SEED, n_jobs=1))])",
    "n": "...with 50 decision trees."
   },
   {
    "c": "tune('Bagging', bagging, {'model__max_samples': [0.3, 0.6, 1.0],",
    "n": "Tunes the share of rows each tree sees..."
   },
   {
    "c": "                          'model__estimator__min_samples_leaf': [1, 20, 50]})",
    "n": "...and the minimum leaf size of each tree."
   },
   {
    "c": "# ..."
   },
   {
    "c": "forest = Pipeline(steps_for(TREE_FS, False) + [('model', RandomForestClassifier(n_estimators=300, random_state=SEED, n_jobs=1))])",
    "n": "Builds a random forest of 300 trees on F1."
   },
   {
    "c": "tune('Random forest', forest, {'model__max_depth': [8, 12, 16, None],",
    "n": "Tunes the depth..."
   },
   {
    "c": "                               'model__min_samples_leaf': [1, 5, 10, 20, 40],",
    "n": "...the minimum leaf size..."
   },
   {
    "c": "                               'model__max_features': ['sqrt', 0.3, 0.5]}, random_search=True, n_iter=14)",
    "n": "...and how many features each split may look at, with random search over 14 settings."
   }
  ],
  "plain": [
   "Both average many trees. The random forest also limits the features each split can use."
  ],
  "say": [
   "Bagging and random forest lower variance."
  ],
  "output": [
   "`Bagging: CV AUC 0.8239 (+/- 0.0034)`",
   "`Random forest: CV AUC 0.8254 (+/- 0.0030)`"
  ],
  "lesson": "bagging"
 },
 {
  "id": "boosting",
  "title": "Ensembles: gradient boosting",
  "cells": [
   45
  ],
  "section": "Bagging, random forest and gradient boosting (Week 11)",
  "lines": [
   {
    "c": "boost = Pipeline(steps_for(TREE_FS, False) + [('model', HistGradientBoostingClassifier(",
    "n": "Builds the gradient boosting pipeline on F1..."
   },
   {
    "c": "    max_iter=1000, early_stopping=True, validation_fraction=0.1, n_iter_no_change=30, random_state=SEED))])",
    "n": "...up to 1,000 trees, with early stopping on a 10% hold-back after 30 rounds with no gain."
   },
   {
    "c": "tune('Gradient boosting', boost, {'model__learning_rate': loguniform(0.01, 0.2),",
    "n": "Tunes the learning rate on a log scale..."
   },
   {
    "c": "                                  'model__max_leaf_nodes': randint(8, 64),",
    "n": "...the number of leaves per tree..."
   },
   {
    "c": "                                  'model__min_samples_leaf': randint(20, 300),",
    "n": "...the minimum leaf size..."
   },
   {
    "c": "                                  'model__l2_regularization': loguniform(1e-3, 10),",
    "n": "...the L2 penalty..."
   },
   {
    "c": "                                  'model__max_features': uniform(0.4, 0.6)}, random_search=True, n_iter=25)",
    "n": "...and the share of features, with random search over 25 settings."
   }
  ],
  "plain": [
   "Boosting adds small trees one after another. Early stopping decides how many."
  ],
  "say": [
   "Boosting lowers bias. Early stopping picked 287 trees."
  ],
  "output": [
   "`Gradient boosting: CV AUC 0.8293 (+/- 0.0030)`",
   "best: learning rate 0.033, 23 leaves, min leaf 290, L2 0.13, 43% of features"
  ],
  "lesson": "boosting"
 },
 {
  "id": "voting",
  "title": "Soft voting",
  "cells": [
   47
  ],
  "section": "Soft voting (Week 11)",
  "lines": [
   {
    "c": "voting = VotingClassifier([('boost', searches['Gradient boosting'].best_estimator_),",
    "n": "Combines the best boosting model..."
   },
   {
    "c": "                           ('logreg', searches['Logistic regression'].best_estimator_),",
    "n": "...the best logistic regression..."
   },
   {
    "c": "                           ('mlp', searches['MLP'].best_estimator_)], voting='soft', n_jobs=1)",
    "n": "...and the best MLP, averaging their probabilities."
   },
   {
    "c": "scores = checkpoint('voting_cv', lambda: cross_val_score(voting, X_dev, y_dev, cv=cv, scoring='roc_auc', n_jobs=-1))",
    "n": "Scores the ensemble with the same 5 folds, or loads the saved score."
   },
   {
    "c": "# ..."
   },
   {
    "c": "print(f'Soft voting: CV AUC {scores.mean():.4f}')",
    "n": "Prints the ensemble's CV AUC."
   }
  ],
  "plain": [
   "The three best different models are averaged."
  ],
  "say": [
   "Averages the probabilities of boosting, logistic regression and the MLP."
  ],
  "output": [
   "`Soft voting: CV AUC 0.8291`"
  ],
  "lesson": "voting"
 },
 {
  "id": "cvtable",
  "title": "The CV results table",
  "cells": [
   49,
   50
  ],
  "section": "All cross-validation results",
  "lines": [
   {
    "c": "cv_table = pd.DataFrame(results).sort_values('cv_auc', ascending=False).reset_index(drop=True)",
    "n": "Turns all results into a table, sorted from best to worst CV AUC."
   },
   {
    "c": "cv_table['gap'] = cv_table['train_auc'] - cv_table['cv_auc']",
    "n": "Adds the gap: training AUC minus validation AUC."
   },
   {
    "c": "cv_table[['model', 'cv_auc', 'cv_sd', 'train_auc', 'gap', 'settings_tried', 'best_settings']].round(4)",
    "n": "Shows the main columns, rounded to 4 decimals."
   },
   {
    "c": "# ..."
   },
   {
    "c": "plot_df = cv_table[cv_table['model'] != 'Baseline'].iloc[::-1]",
    "n": "Takes every model except the baseline, in reverse order for the plot."
   },
   {
    "c": "plt.figure(figsize=(7, 4))",
    "n": "Starts a new figure."
   },
   {
    "c": "plt.barh(plot_df['model'], plot_df['cv_auc'], xerr=plot_df['cv_sd'], capsize=3)",
    "n": "Draws a bar per model, with the SD as an error bar."
   },
   {
    "c": "plt.xlim(0.795, 0.84)",
    "n": "Zooms the x-axis to the range where the models differ."
   }
  ],
  "plain": [
   "This is the main comparison of all tuned models."
  ],
  "say": [
   "This is my main comparison. Gap = train minus validation AUC."
  ],
  "output": [
   "Boosting 0.8293, voting 0.8291, MLP 0.8270 at the top.",
   "Gap column: random forest 0.0319, logistic regression 0.0007."
  ],
  "lesson": "gap"
 },
 {
  "id": "selection",
  "title": "Selection: the one-standard-error rule",
  "cells": [
   52
  ],
  "section": "5. Choose the best model",
  "lines": [
   {
    "c": "top = cv_table.iloc[0]",
    "n": "Takes the top model by CV AUC."
   },
   {
    "c": "standard_error = top['cv_sd'] / np.sqrt(5)",
    "n": "Standard error = its SD divided by the square root of 5 folds."
   },
   {
    "c": "tied = cv_table[cv_table['cv_auc'] >= top['cv_auc'] - standard_error]['model'].tolist()",
    "n": "Every model within one standard error of the top counts as tied."
   },
   {
    "c": "print('Tied models:', tied)",
    "n": "Prints the tied models."
   },
   {
    "c": ""
   },
   {
    "c": "simplest_first = ['Logistic regression', 'Decision tree', 'Gradient boosting', 'Random forest',",
    "n": "Ranks the models from simplest to most complex..."
   },
   {
    "c": "                  'k-NN', 'Bagging', 'MLP', 'SVM', 'Soft voting']",
    "n": "...continuing the list."
   },
   {
    "c": "chosen = [m for m in simplest_first if m in tied][0]",
    "n": "Picks the first tied model on the simplest-first list."
   },
   {
    "c": "print('Chosen model:', chosen)",
    "n": "Prints the chosen model."
   }
  ],
  "plain": [
   "The rule was set before the test set was opened, so the choice cannot be influenced by test results."
  ],
  "say": [
   "The one-standard-error rule, fixed before testing. Tied: boosting and voting. I choose the simpler one."
  ],
  "output": [
   "`Tied models: ['Gradient boosting', 'Soft voting']`",
   "`Chosen model: Gradient boosting`"
  ],
  "lesson": "one-se"
 },
 {
  "id": "test",
  "title": "Test: one score per model, with bootstrap CIs",
  "cells": [
   54,
   55
  ],
  "section": "6. Test every model once on the test set",
  "lines": [
   {
    "c": "def fit_and_score(name):",
    "n": "Defines a function that refits one model and scores the test set."
   },
   {
    "c": "    model = final_models[name]",
    "n": "Takes the tuned model."
   },
   {
    "c": "    model.fit(X_dev, y_dev)",
    "n": "Refits it on all development rows."
   },
   {
    "c": "    return model, get_scores(model, X_test), model.predict(X_test)",
    "n": "Returns the model, its test scores and its yes/no predictions."
   },
   {
    "c": "# ..."
   },
   {
    "c": "rng = np.random.default_rng(SEED)",
    "n": "Makes a random number generator with the fixed seed."
   },
   {
    "c": "boot_samples = [rng.integers(0, len(y_test), len(y_test)) for _ in range(1000)]",
    "n": "Draws 1,000 bootstrap samples of test rows, with replacement."
   },
   {
    "c": "# ..."
   },
   {
    "c": "    boot_auc = [roc_auc_score(y_true[b], s[b]) for b in boot_samples]",
    "n": "Computes AUC on each bootstrap sample."
   },
   {
    "c": "    test_rows.append({'model': name,",
    "n": "Starts the result row for this model."
   },
   {
    "c": "                      'test_auc': roc_auc_score(y_true, s),",
    "n": "The test AUC on the full test set."
   },
   {
    "c": "                      'auc_95_ci': f'{np.percentile(boot_auc, 2.5):.3f} to {np.percentile(boot_auc, 97.5):.3f}',",
    "n": "The 95% CI: the 2.5th and 97.5th percentiles of the bootstrap AUCs."
   }
  ],
  "plain": [
   "Each model is refit once on the development set and scored once on the test set. The bootstrap shows how much each score could move by chance. Cell 55 draws the ROC curves."
  ],
  "say": [
   "Each model is refit on all 50,897 development rows and scored once on 12,725 test rows, with bootstrap 95% CIs."
  ],
  "output": [
   "Gradient boosting: `0.8346`, `0.828 to 0.841`, accuracy 0.7551, recall 0.7977.",
   "Cell 55: the ROC curves nearly on top of each other."
  ],
  "lesson": "bootstrap-ci"
 },
 {
  "id": "paired",
  "title": "Paired bootstrap",
  "cells": [
   57
  ],
  "section": "Is the chosen model really better?",
  "lines": [
   {
    "c": "for name in test_table['model']:",
    "n": "Loops over every model in the test table..."
   },
   {
    "c": "    if name == chosen:",
    "n": "...skipping the chosen model itself."
   },
   {
    "c": "        continue",
    "n": "Moves on to the next model."
   },
   {
    "c": "    diffs = [roc_auc_score(y_true[b], test_scores[chosen][b]) - roc_auc_score(y_true[b], test_scores[name][b])",
    "n": "On each bootstrap sample, the chosen model's AUC minus this model's AUC..."
   },
   {
    "c": "             for b in boot_samples]",
    "n": "...using the same 1,000 samples for both models."
   },
   {
    "c": "    low, high = np.percentile(diffs, 2.5), np.percentile(diffs, 97.5)",
    "n": "The 95% interval of those differences."
   },
   {
    "c": "    diff_rows.append({'compared_with': name, 'auc_difference': np.mean(diffs),",
    "n": "Saves the mean difference..."
   },
   {
    "c": "                      'low': low, 'high': high, 'really_different': not (low <= 0 <= high)})",
    "n": "...and whether the interval excludes zero (really different)."
   }
  ],
  "plain": [
   "Both models are judged on exactly the same resampled people, so only the model differs."
  ],
  "say": [
   "Boosting vs voting: the interval includes 0, so it is a tie. It beats the other 6.",
   "The MLP is also a tie: its interval includes 0 too."
  ],
  "output": [
   "Soft voting: `-0.0014` to `0.0004`, `False`.",
   "MLP: `-0.0004` to `0.0025`, `False`. The other 6: `True`."
  ],
  "lesson": "paired"
 },
 {
  "id": "inside",
  "title": "Inside the model: confusion matrix and importance",
  "cells": [
   59,
   61
  ],
  "section": "7. Look inside the chosen model",
  "lines": [
   {
    "c": "best = final_models[chosen]",
    "n": "Takes the chosen model, already refit."
   },
   {
    "c": "pred = best.predict(X_test)",
    "n": "Predicts yes/no for the test set at the default 0.5 cut-off."
   },
   {
    "c": "# ..."
   },
   {
    "c": "tn, fp, fn, tp = confusion_matrix(y_true, pred).ravel()",
    "n": "Unpacks the four counts of the confusion matrix."
   },
   {
    "c": "sensitivity, specificity = tp / (tp + fn), tn / (tn + fp)",
    "n": "Sensitivity (recall) = TP / (TP + FN). Specificity = TN / (TN + FP)."
   },
   {
    "c": "# ..."
   },
   {
    "c": "imp = checkpoint('permutation_importance', lambda: permutation_importance(",
    "n": "Measures permutation importance, or loads it if saved..."
   },
   {
    "c": "    best, X_test, y_test, scoring='roc_auc', n_repeats=5, random_state=SEED, n_jobs=-1))",
    "n": "...shuffling each column 5 times on the test set and recording the AUC drop."
   },
   {
    "c": "importance = pd.Series(imp.importances_mean, index=X_test.columns).sort_values()",
    "n": "Puts the mean drops in a labelled list, sorted."
   }
  ],
  "plain": [
   "The confusion matrix shows the four kinds of right and wrong answers. Permutation importance shows which inputs the model relies on."
  ],
  "say": [
   "Recall 79.8%, specificity 71.3%. GenHlth, BMI, Age and HighBP drive the model."
  ],
  "output": [
   "`Sensitivity (recall): 0.7977`",
   "`Specificity: 0.7126`",
   "Cell 61: GenHlth 0.0575, BMI 0.0377, Age 0.0259, HighBP 0.0184, HighChol 0.0112."
  ],
  "lesson": "permutation"
 },
 {
  "id": "cutoff",
  "title": "Choosing the cut-off",
  "cells": [
   63,
   64
  ],
  "section": "Choosing the cut-off for screening",
  "lines": [
   {
    "c": "dev_prob = checkpoint('dev_oof_prob', lambda: cross_val_predict(",
    "n": "Gets out-of-fold probabilities for every development row, or loads them..."
   },
   {
    "c": "    best, X_dev, y_dev, cv=cv, method='predict_proba', n_jobs=-1)[:, 1])",
    "n": "...from models that never saw that row. The test set is not used."
   },
   {
    "c": "precision, recall, cutoffs = precision_recall_curve(y_dev, dev_prob)",
    "n": "Computes precision and recall at every possible cut-off."
   },
   {
    "c": "cutoff = cutoffs[np.where(precision[:-1] >= 0.65)[0][0]]",
    "n": "Takes the lowest cut-off where precision is still 0.65 or above."
   },
   {
    "c": "print(f'Chosen cut-off: {cutoff:.3f}')",
    "n": "Prints the chosen cut-off."
   },
   {
    "c": "# ..."
   },
   {
    "c": "test_prob = best.predict_proba(X_test)[:, 1]",
    "n": "Gets the chosen model's probabilities for the test set."
   },
   {
    "c": "for c in [cutoff, 0.5]:",
    "n": "Compares the chosen cut-off with 0.5..."
   },
   {
    "c": "    p = (test_prob >= c).astype(int)",
    "n": "...turning probabilities into yes/no at each one."
   },
   {
    "c": "# ..."
   },
   {
    "c": "plt.plot(grid, [recall_score(y_dev, dev_prob >= c) for c in grid], label='Recall')",
    "n": "Plots recall at every cut-off on development predictions."
   },
   {
    "c": "plt.plot(grid, [precision_score(y_dev, dev_prob >= c, zero_division=0) for c in grid], label='Precision')",
    "n": "Plots precision at every cut-off."
   }
  ],
  "plain": [
   "The cut-off is chosen on development predictions only. Then both cut-offs are reported on the test set."
  ],
  "say": [
   "Chosen on development predictions only. 0.27 gives 93.9% recall."
  ],
  "output": [
   "`Chosen cut-off: 0.273`",
   "`cut-off 0.27: accuracy 0.721, precision 0.654, recall 0.939`",
   "`cut-off 0.50: accuracy 0.755, precision 0.735, recall 0.798`"
  ],
  "lesson": "cutoff"
 },
 {
  "id": "final",
  "title": "Final model on all the data",
  "cells": [
   66
  ],
  "section": "8. Train the final model on all the labelled data",
  "lines": [
   {
    "c": "final = checkpoint('final_model', lambda: final_models[chosen].fit(X, y))",
    "n": "Refits the chosen model on all 63,622 rows, or loads it if saved."
   },
   {
    "c": "print('Final model:', chosen)",
    "n": "Prints the chosen model's name."
   },
   {
    "c": "print('Settings:', searches[chosen].best_params_)",
    "n": "Prints its best settings."
   },
   {
    "c": "print(f'Expected AUC on new people (from the test set): {roc_auc_score(y_true, test_scores[chosen]):.4f}')",
    "n": "Prints the test AUC as the honest estimate for new people."
   }
  ],
  "plain": [
   "The settings are fixed, so the model is trained one last time on every labelled row."
  ],
  "say": [
   "Refit on all 63,622 rows for deployment. The test score stays the honest estimate."
  ],
  "output": [
   "`Final model: Gradient boosting`",
   "`Expected AUC on new people (from the test set): 0.8346`"
  ],
  "lesson": "refit"
 },
 {
  "id": "qa",
  "title": "Q&A cell: your backup",
  "cells": [
   67
  ],
  "section": "Answers to the 5 official questions",
  "lines": [
   {
    "c": "print('Q1. What classification methods did you use?')",
    "n": "Prints official question 1."
   },
   {
    "c": "print('   ', ', '.join(methods), '+ a majority-class baseline.')",
    "n": "Prints the list of methods, plus the baseline."
   },
   {
    "c": "# ..."
   },
   {
    "c": "print('\\nQ3. Did you apply any data pre-processing?')",
    "n": "Prints official question 3."
   },
   {
    "c": "print('    Dropped pid (it leaks the label, AUC 1.0 on its own), turned Sex into 0/1, capped BMI at 60,')",
    "n": "Prints the first line of the preprocessing answer."
   }
  ],
  "plain": [
   "This cell prints short answers to the 5 official questions from the real results."
  ],
  "say": [
   "Your backup if your mind goes blank."
  ],
  "output": [
   "The printed Q1 to Q5 answers, for example: `Gradient boosting: CV AUC 0.8293, test AUC 0.8346 (95% CI 0.828 to 0.841), accuracy 0.755.`"
  ],
  "lesson": "three-layers"
 }
];
