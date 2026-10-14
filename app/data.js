// All study content for the AT3 Oral Defence guide.
// Every text here comes from the study guide. Edit here, and the app updates everywhere.
window.DATA = {
  examDate: '2026-10-15',

  // ---------- 1. How you are marked ----------
  marking: {
    intro: `To get 40/40 (Excellent), you have to show an in-depth investigation: many classifiers, valid preprocessing, real parameter tuning and proper evaluation, and then defend each choice when asked "why?". A 2 to 3 sentence answer gets you to Good (30). Adding the reason, a number from your results, and one trade-off gets you to Excellent.`,
    bands: [
      { mark: '40', name: 'Excellent', sees: 'In-depth: multiple classifiers, valid preprocessing, parameter optimisation, model evaluation', evidence: '9 methods + baseline, pid leak found, 4 feature sets tested, grid/random search with 5-fold CV, test set + bootstrap CIs + paired test' },
      { mark: '30', name: 'Good', sees: 'Many classifiers, basic preprocessing, tuning and evaluation', evidence: 'What you get if you only list things without saying why' },
      { mark: '20', name: 'Pass', sees: 'Can answer basic questions about the pipeline and evaluation', evidence: 'Knowing what a train/test split is' }
    ],
    layers: [
      { n: 1, name: 'What', len: '1 sentence', desc: 'The direct answer.', ex: `"Gradient boosting performed best."` },
      { n: 2, name: 'Evidence', len: '1 sentence', desc: 'The number and where it is in the notebook.', ex: `"CV AUC 0.8293 and test AUC 0.8346, shown in Section 4 and Section 6."` },
      { n: 3, name: 'Why / trade-off', len: '1 to 2 sentences', desc: 'The reasoning, an alternative you considered, and why you rejected it.', ex: `"Soft voting was tied, but it is three models for no real gain, so by my one-standard-error rule I chose the simpler one."` }
    ],
    layersNote: 'Layers 1 and 2 alone = Good. Adding layer 3 = Excellent. Stop after layer 3 and let them ask the next question. Do not talk for more than about 40 seconds per answer.',
    rules: [
      `Always point at the screen: "You can see it here in this cell." Showing working code is part of the criteria.`,
      'Say numbers to 3 decimals (0.835, not 0.83462).',
      `If you don't know: "I didn't test that, but my expectation is X because Y. I would check it by Z." This still sounds in-depth.`,
      'Never claim something the notebook does not show.'
    ]
  },

  // ---------- 2. The 90-second story ----------
  storyIntro: 'Open with this, scrolling the notebook as you speak. Learn it close to word for word. It answers 4 of the 5 official questions before they even ask.',
  story: [
    `My task was to predict Diabetes_binary from 21 BRFSS survey answers. It is a supervised binary classification problem, and I treated it as a screening tool, so my main metric was ROC AUC.`,
    `First I checked the data. I found that pid leaks the label: all class 0 rows come first, then all class 1. One split on pid gives AUC 1.0, so I dropped it.`,
    `Then I held out 20% as a test set and did everything else with stratified 5-fold cross-validation on the other 80%. All preprocessing is inside pipelines, so nothing leaks between folds.`,
    `I made 9 new features and compared 4 feature sets. Then I tuned one model for every method from Weeks 7 to 11: decision tree, k-NN, logistic regression, MLP, SVM, bagging, random forest, gradient boosting and soft voting, using grid or random search.`,
    `Gradient boosting was best, with CV AUC 0.829 and test AUC 0.835. Soft voting was tied, so I picked boosting by a one-standard-error rule set in advance, because it is simpler. Finally I checked which features drive it and picked a screening cut-off.`
  ],
  storyEnd: `I'm happy to go into any part of the code.`,
  storyNote: 'That is about 150 words, which is about 75 seconds when spoken calmly.',
  storyBeats: ['Task + metric', 'pid leak', 'Split + CV + pipelines', 'Features + 9 models', 'Result + rule + cut-off'],
  storyKeys: ['Diabetes_binary', '21', 'BRFSS', 'supervised binary classification', 'screening', 'ROC AUC', 'pid', 'class 0', 'class 1', 'AUC 1.0', '20%', 'stratified 5-fold', '80%', 'pipelines', '9', '4', 'Weeks 7 to 11', 'decision tree', 'k-NN', 'logistic regression', 'MLP', 'SVM', 'bagging', 'random forest', 'gradient boosting', 'soft voting', 'grid or random search', 'Gradient boosting', '0.829', '0.835', 'one-standard-error rule', 'simpler', 'cut-off'],

  // ---------- 3. Numbers to remember ----------
  numbersNote: 'Memorise the key numbers (marked ★). The rest you can read off the screen.',
  numbers: [
    { topic: 'Records / columns', value: '63,622 rows, 23 columns (pid + target + 21 attributes)', key: true },
    { topic: 'Class balance', value: '31,811 each = exactly 50/50 (real prevalence about 14%)', key: true },
    { topic: 'Split', value: 'Development 50,897 (80%), test 12,725 (20%), stratified, seed 42', key: true },
    { topic: 'Cross-validation', value: 'Stratified 5-fold, about 40,718 train / 10,179 validate per fold' },
    { topic: 'pid leak', value: 'One-split tree on pid = AUC 1.000', key: true },
    { topic: 'Duplicates', value: '1,365 (2.1%), kept' },
    { topic: 'BMI', value: '231 rows above 60, capped at 60' },
    { topic: 'New features', value: '9 (BMI_clip, BMI_cat, CardioCount, BP_Chol, Age_BMI, Lifestyle, FreqPhysDistress, FreqMentDistress, PoorHealth)', key: true },
    { topic: 'Feature sets', value: 'F0 raw, F1 +features, F2 +one-hot, F3 filtered. Linear models use F2, trees and k-NN use F1', key: true },
    { topic: 'Best model', value: 'Gradient boosting: CV AUC 0.829 (0.8293 ± 0.0030), test AUC 0.835 (95% CI 0.828 to 0.841)', key: true },
    { topic: 'Best model test metrics', value: 'Accuracy 75.5%, precision 73.5%, recall 79.8%, specificity 71.3%, F1 0.765', key: true },
    { topic: 'Best settings', value: 'Learning rate 0.033, 23 max leaves, min leaf 290, L2 0.13, 43% of features, stopped at 287 trees' },
    { topic: 'Runner-up', value: 'Soft voting: CV 0.8291, test 0.8351 (tied, not significantly different)', key: true },
    { topic: 'Worst tuned', value: 'Decision tree: CV 0.816, test 0.822' },
    { topic: 'Spread of all models', value: 'All within 0.013 AUC on test', key: true },
    { topic: 'One-SE rule', value: 'SE = 0.0030 / √5 = 0.0013, so the tie band is CV AUC ≥ 0.828', key: true },
    { topic: 'SVM trap', value: '10k sample: 0.832 (SD 0.010). Full data: 0.826' },
    { topic: 'Top features', value: 'GenHlth 0.057, BMI 0.038, Age 0.026, HighBP 0.018, HighChol 0.011 (drop in AUC)', key: true },
    { topic: 'Cut-off', value: '0.27 gives recall 93.9%, precision 65.4%, accuracy 72.1% (vs 0.5: recall 79.8%)', key: true },
    { topic: 'Confusion matrix (0.5)', value: 'TN 4,534 · FP 1,829 · FN 1,287 · TP 5,075' }
  ],

  // Flashcard drill for numbers (question → answer)
  numberCards: [
    { q: 'How many rows and columns?', a: '63,622 rows, 23 columns (pid + target + 21 attributes)' },
    { q: 'Class balance?', a: '31,811 each = exactly 50/50. Real prevalence is about 14%.' },
    { q: 'Development and test set sizes?', a: 'Development 50,897 (80%), test 12,725 (20%). Stratified, seed 42.' },
    { q: 'Random seed?', a: 'SEED = 42, fixed everywhere so every result can be repeated exactly.' },
    { q: 'Rows per CV fold?', a: 'Stratified 5-fold: about 40,718 train / 10,179 validate per fold.' },
    { q: 'AUC of a one-split tree on pid?', a: '1.000. Target leakage, so pid was dropped.' },
    { q: 'How many duplicates, and what did you do?', a: '1,365 (2.1%), kept.' },
    { q: 'How many BMI rows above 60?', a: '231 rows, capped at 60.' },
    { q: 'How many new features? Name them.', a: '9: BMI_clip, BMI_cat, CardioCount, BP_Chol, Age_BMI, Lifestyle, FreqPhysDistress, FreqMentDistress, PoorHealth.' },
    { q: 'What are the 4 feature sets?', a: 'F0 raw, F1 +features, F2 +one-hot, F3 filtered.' },
    { q: 'Which feature set for which models?', a: 'Linear models use F2. Trees and k-NN use F1. F3 hurt boosting, so that idea was dropped.' },
    { q: 'Best model and its CV AUC?', a: 'Gradient boosting: CV AUC 0.829 (0.8293 ± 0.0030).' },
    { q: 'Best model test AUC and 95% CI?', a: 'Test AUC 0.835 (95% CI 0.828 to 0.841).' },
    { q: 'Best model accuracy, precision, recall?', a: 'Accuracy 75.5%, precision 73.5%, recall 79.8%.' },
    { q: 'Best model specificity and F1?', a: 'Specificity 71.3%, F1 0.765.' },
    { q: 'Best boosting settings?', a: 'Learning rate 0.033, 23 max leaves, min leaf 290, L2 0.13, 43% of features, stopped at 287 trees.' },
    { q: 'How many trees did early stopping pick?', a: '287 trees.' },
    { q: 'Runner-up model and scores?', a: 'Soft voting: CV 0.8291, test 0.8351 (tied, not significantly different).' },
    { q: 'Test AUC difference voting vs boosting, and paired interval?', a: '0.8351 vs 0.8346 = 0.0005. Paired bootstrap interval −0.0014 to +0.0004 includes zero, so it is a tie.' },
    { q: 'Worst tuned model?', a: 'Decision tree: CV 0.816, test 0.822.' },
    { q: 'Spread of all models on test?', a: 'All within 0.013 AUC on test.' },
    { q: 'One-SE rule calculation?', a: 'SE = 0.0030 / √5 = 0.0013, so the tie band is CV AUC ≥ 0.828.' },
    { q: 'The SVM trap numbers?', a: '10k sample: 0.832 (SD 0.010). Full data: 0.826.' },
    { q: 'Top 5 features (drop in AUC)?', a: 'GenHlth 0.057, BMI 0.038, Age 0.026, HighBP 0.018, HighChol 0.011.' },
    { q: 'What does the 0.27 cut-off give?', a: 'Recall 93.9%, precision 65.4%, accuracy 72.1% (vs 0.5: recall 79.8%).' },
    { q: 'Confusion matrix at 0.5?', a: 'TN 4,534 · FP 1,829 · FN 1,287 · TP 5,075.' },
    { q: 'Overfitting gaps (train − validation AUC)?', a: 'Random forest 0.032 (most overfit), boosting 0.012, logistic regression 0.001 (almost none).' },
    { q: 'Decision tree depth curve numbers?', a: 'Validation AUC peaks around depth 7, then falls to 0.66 at depth 25 while training AUC goes to 1.0. A depth-2 tree scores about AUC 0.75 (high bias).' },
    { q: 'How much did the new features help k-NN and logistic regression?', a: 'k-NN 0.812 → 0.816. Logistic regression 0.823 → 0.826. Boosting barely changed.' },
    { q: 'Mutual-information filter threshold?', a: 'Five features scored below 0.005, and those are dropped in F3.' },
    { q: 'Early stopping details?', a: 'Holds back 10% of the training data and stops when that score stops improving for 30 rounds. Stopped at 287 trees.' },
    { q: 'How many bootstrap resamples?', a: '1,000 bootstrap samples of the 12,725 test rows; 2.5th and 97.5th percentiles give the 95% CI.' },
    { q: 'How many decision tree combinations searched?', a: '70 combinations.' },
    { q: 'MLP random search size and winner?', a: '16 settings. Best: one layer of 64 tanh neurons, alpha 0.062. CV 0.827.' },
    { q: 'SVM search size and why a sample?', a: '12 settings × 5 folds on 50,000 rows was too slow (cost grows roughly with rows²), so searched on 10,000 rows, then re-scored the winner on full data.' },
    { q: 'HvyAlcoholConsump conditional finding?', a: 'Heavy drinkers: 27.8% diabetes vs 51.0%. Low MI alone, but it matters once age and BMI are known.' },
    { q: 'Final deployment refit uses how many rows?', a: 'All 63,622 rows. The test score stays the honest estimate.' },
    { q: 'Recall at 0.5 in plain words?', a: '79.8%: it catches 4 in 5 people with diabetes.' }
  ],

  // ---------- 4. The 5 official questions ----------
  official: [
    {
      id: 1, q: 'What classification methods did you use?',
      good: `I built one model for every method from Weeks 7 to 11: a decision tree, k-NN, logistic regression as the linear classifier, an MLP, an SVM, and the ensembles: bagging, random forest, gradient boosting and a soft-voting ensemble. I also used a majority-class baseline as the floor, which scores AUC 0.5.`,
      excellent: `They cover different ideas on purpose. The tree and the ensembles split the data into rules. k-NN uses distance. Logistic regression and the linear SVM draw a straight boundary. The MLP learns non-linear combinations. That way I could see whether the problem rewards complexity. It mostly didn't: all nine were within 0.013 AUC, which tells me the limit comes from the data, not the algorithm.`,
      show: 'Section 4 headings, then the CV results table (cell 49).', cells: [49]
    },
    {
      id: 2, q: 'Which method achieved the best performance?',
      good: `Gradient boosting. It had the highest cross-validated AUC, 0.829, and on the untouched test set it scored AUC 0.835 with 75.5% accuracy and 79.8% recall.`,
      excellent: `Soft voting actually scored 0.0005 higher on test, but a paired bootstrap shows the difference is not real, because the interval includes zero. My rule, set before testing, was: anything within one standard error of the top CV score is a tie, and then choose the simplest. Boosting is one model instead of three. It is significantly better than logistic regression, the SVM, the random forest, bagging, k-NN and the tree.`,
      show: 'Cell 52 (tied models), cell 54 (test table), cell 57 (paired bootstrap).', cells: [52, 54, 57]
    },
    {
      id: 3, q: 'Did you apply any data preprocessing?',
      good: `Yes. I dropped pid because it leaks the label, turned Sex into 0/1, capped BMI at 60, added 9 new features, one-hot encoded the ordinal codes for linear models, and z-score scaled the inputs for the distance and gradient-based models.`,
      excellent: `Two points matter most. First, the pid leak: one split on pid gives AUC 1.0, because the file is sorted by class. That would have given a fake perfect model. Second, all of this happens inside a scikit-learn pipeline. In each fold the scaler is fitted on the training part only, so the validation part never leaks into its own preprocessing. I also tested whether the features helped: they lifted k-NN from 0.812 to 0.816 and logistic regression from 0.823 to 0.826, but barely changed boosting, because trees already find interactions themselves.`,
      show: 'Cell 10 (pid plot), cell 16 (add_features), cell 19 (steps_for), cell 21 (feature-set table).', cells: [10, 16, 19, 21]
    },
    {
      id: 4, q: 'How did you set the hyper-parameters, and how did you use them for model selection?',
      good: `I used GridSearchCV when there were few settings, and RandomizedSearchCV when there were many, like the MLP, random forest and boosting. Every search used the same stratified 5-fold cross-validation on the development set and scored ROC AUC. The best setting of each model then went into the final comparison.`,
      excellent: `I also checked overfitting with the gap between training AUC and validation AUC. The random forest had the biggest gap, 0.032. Boosting stayed small at 0.012 thanks to a low learning rate, big leaves and early stopping. For the decision tree I plotted a validation curve. Validation AUC peaks around depth 7 and then falls to 0.66 at depth 25 while training AUC goes to 1.0, which is the bias-variance trade-off. For the SVM, the search ran on a 10,000-row sample for speed, but I re-scored the winner on the full data, because the sample score of 0.832 was noisy and would have wrongly ranked it first.`,
      show: 'Cell 26 (the tune function), cell 45 (boosting search), cell 31 (depth curve), cell 41 (SVM re-score).', cells: [26, 45, 31, 41]
    },
    {
      id: 5, q: 'How did you evaluate and compare the classifiers?',
      good: `Every model was compared with the same 5 folds and the same metric, ROC AUC. Then I scored them all once on a 20% test set that I had kept aside from the start, and I also report accuracy, precision, recall, F1 and a confusion matrix.`,
      excellent: `I chose AUC because this is a screening problem. AUC measures ranking across every cut-off, and the cut-off can be chosen later. To know if differences were real, I used 1,000 bootstrap samples of the test set for 95% confidence intervals, and a paired bootstrap that compares two models on the same resampled people. Finally, I chose a screening cut-off of 0.27 using only development-set predictions. It lifts recall from 79.8% to 93.9%.`,
      show: 'Cell 54 (test table with CIs), cell 55 (ROC curves), cell 57 (paired test), cell 59 (confusion matrix), cell 63 (cut-off).', cells: [54, 55, 57, 59, 63]
    }
  ],

  // ---------- 5. Code walkthrough ----------
  walkIntro: `Open the notebook already run, with outputs showing (all steps load from Drive in about a minute). Use Colab's Table of contents (the list icon on the left) to jump between sections. "Cell N" in this guide counts every cell from the top, starting at 0. The section heading next to it is the easier landmark.`,
  walkthrough: [
    { section: '0 Setup', cells: [2], code: `SEED = 42, set_config(transform_output='pandas')`, say: `Fixed seed everywhere, so every result can be repeated exactly.` },
    { section: 'Drive + checkpoint', cells: [4], code: `checkpoint(name, make)`, say: `Colab kept disconnecting, so every slow step is saved to Drive and reloaded on a rerun. It does not change any result.` },
    { section: '1 Data check', cells: [8], code: `isna(), duplicated(), value_counts()`, say: `No missing values, 1,365 duplicates I kept, classes exactly 50/50.` },
    { section: '1.1 pid leak', cells: [10], code: `pd.cut(data['pid'], 20), DecisionTreeClassifier(max_depth=1)`, say: `The rate jumps from 0 to 1, and one split on pid gives AUC 1.0. That is target leakage, so I drop pid.` },
    { section: '1.2 Clean', cells: [12], code: `X['Sex'] = (... == 'male').astype(int)`, say: `Binarisation: two values only need one 0/1 column.` },
    { section: '2 Split', cells: [14], code: `train_test_split(..., test_size=0.20, stratify=y)`, say: `Stratify keeps the 50/50 balance in both parts. The test set is touched only once, in Section 6.` },
    { section: '3 Features', cells: [16], code: `add_features, one_hot, dummy_columns`, say: `Row-wise features, so they are safe in a pipeline. BMI capped at 60, WHO bands, interactions like HighBP × HighChol from my AT2 finding.` },
    { section: 'Mutual info', cells: [18], code: `mutual_info_classif, low_mi`, say: `A filter method that scores each feature alone. Five scored below 0.005, and those are dropped in F3.` },
    { section: 'Pipelines', cells: [19], code: `steps_for(feature_set, scale)`, say: `This builds the preprocessing per feature set. scale=True adds a StandardScaler for k-NN, linear models, MLP and SVM. The 0/1 dummy columns are left unscaled.` },
    { section: 'Feature sets', cells: [21], code: `cross_val_score(pipe, X_dev, y_dev, cv=cv)`, say: `Same 5 folds for all. Linear models are best with F2, trees and k-NN with F1. F3 hurt boosting, so I dropped that idea.` },
    { section: '4 tune()', cells: [26], code: `GridSearchCV / RandomizedSearchCV, scoring='roc_auc', best_index_, mean_train_score`, say: `One function for every model: same folds, same metric. It records the CV AUC, its spread and the training AUC so I can see overfitting.` },
    { section: 'Tree', cells: [30, 31], code: `max_depth, min_samples_leaf, criterion, validation_curve`, say: `70 combinations. The depth curve shows the bias-variance trade-off.` },
    { section: 'k-NN', cells: [33], code: `n_neighbors, weights, metric`, say: `Best is k = 201 with Manhattan distance. Many 0/1 ties need a big neighbourhood.` },
    { section: 'Logistic', cells: [36], code: `C, penalty`, say: `C = 0.01, strong L2 regularisation.` },
    { section: 'MLP', cells: [38], code: `hidden_layer_sizes, alpha, early_stopping=True`, say: `Random search over 16 settings. Best is one layer of 64 tanh neurons.` },
    { section: 'SVM', cells: [40, 41], code: `train_size=10000, full_scores`, say: `Searched on a sample for speed, then re-scored on full data: 0.832 dropped to 0.826.` },
    { section: 'Ensembles', cells: [43, 44, 45], code: `BaggingClassifier, RandomForestClassifier, HistGradientBoostingClassifier(early_stopping=True)`, say: `Bagging and random forest lower variance. Boosting lowers bias. Early stopping picked 287 trees.` },
    { section: 'Voting', cells: [47], code: `VotingClassifier(..., voting='soft')`, say: `Averages the probabilities of boosting, logistic regression and the MLP.` },
    { section: 'CV table', cells: [49, 50], code: `gap column`, say: `This is my main comparison. Gap = train minus validation AUC.` },
    { section: '5 Selection', cells: [52], code: `standard_error = top['cv_sd'] / np.sqrt(5)`, say: `The one-standard-error rule, fixed before testing. Tied: boosting and voting. I choose the simpler one.` },
    { section: '6 Test', cells: [54, 55], code: `boot_samples, roc_auc_score`, say: `Each model is refit on all 50,897 development rows and scored once on 12,725 test rows, with bootstrap 95% CIs.` },
    { section: 'Paired test', cells: [57], code: `really_different`, say: `Boosting vs voting: the interval includes 0, so it is a tie. It beats the other 6.` },
    { section: '7 Inside', cells: [59, 61], code: `confusion_matrix, permutation_importance`, say: `Recall 79.8%, specificity 71.3%. GenHlth, BMI, Age and HighBP drive the model.` },
    { section: 'Cut-off', cells: [63, 64], code: `cross_val_predict, precision_recall_curve`, say: `Chosen on development predictions only. 0.27 gives 93.9% recall.` },
    { section: '8 Final', cells: [66], code: `.fit(X, y)`, say: `Refit on all 63,622 rows for deployment. The test score stays the honest estimate.` },
    { section: '9 Q&A', cells: [67], code: `printed answers`, say: `Your backup if your mind goes blank.` }
  ],

  // ---------- 6. Every model in plain words ----------
  modelsIntro: 'For each model, know: how it decides, what its settings control, what you found, and one weakness.',
  models: [
    { name: 'Decision tree', week: 'W7', how: 'Asks yes/no questions, choosing at each step the split that makes groups purest (Gini, or entropy = information gain, as in ID3)', settings: 'max_depth: how many questions. min_samples_leaf: minimum people per final group. criterion: gini or entropy', result: 'Entropy, depth 8, leaf 200. CV 0.816', weak: 'Deep trees memorise the data (high variance). Unstable' },
    { name: 'k-NN', week: 'W8', how: 'Finds the k most similar people and takes their majority', settings: 'n_neighbors (k), weights (uniform or closer = more say), metric (Euclidean or Manhattan)', result: 'k = 201, uniform, Manhattan. CV 0.820', weak: 'Needs scaling. Slow to predict. Struggles with many 0/1 ties' },
    { name: 'Logistic regression', week: 'W9', how: 'Weighted sum of inputs passed through a sigmoid to get a probability. Linear boundary', settings: 'C: inverse regularisation (small C = weights kept small). penalty: L1 (can zero weights) or L2', result: 'C = 0.01, L2. CV 0.826, gap 0.001', weak: `Can't find interactions unless you give them` },
    { name: 'MLP', week: 'W9', how: 'Layers of neurons. Each layer re-combines the last, so it can learn curved boundaries', settings: 'hidden_layer_sizes, activation (relu or tanh), alpha (L2 penalty), learning_rate_init, early_stopping', result: '1 layer × 64 tanh, alpha 0.062. CV 0.827', weak: 'Black box. Depends on starting weights and scaling' },
    { name: 'SVM', week: 'W10', how: 'Finds the boundary with the widest margin between classes. Kernels allow curved boundaries', settings: 'kernel (linear or RBF), C (how much to punish mistakes), gamma (how local the RBF is)', result: 'Linear, C = 0.01. CV 0.826', weak: 'Training cost grows roughly with rows². Hard to explain' },
    { name: 'Bagging', week: 'W11', how: 'Many deep trees, each on a bootstrap sample, then a vote', settings: 'max_samples (share of rows per tree), leaf size', result: '30% samples, leaf 20. CV 0.824', weak: 'Lowers variance, not bias' },
    { name: 'Random forest', week: 'W11', how: 'Bagging plus a random subset of features at each split, so the trees differ more', settings: 'max_depth, min_samples_leaf, max_features', result: 'Depth 16, leaf 20, sqrt. CV 0.825. Biggest gap, 0.032', weak: 'Still overfits. Large model' },
    { name: 'Gradient boosting', week: 'W11', how: 'Builds small trees one after another. Each new tree fixes the errors left so far', settings: 'learning_rate (step size), max_leaf_nodes (tree size), min_samples_leaf, l2_regularization, max_features, early stopping', result: 'lr 0.033, 23 leaves, leaf 290, L2 0.13, 43% features, 287 trees. CV 0.829', weak: 'Many settings to tune. Can overfit without early stopping', best: true },
    { name: 'Soft voting', week: 'W11', how: 'Averages the probabilities of boosting, logistic regression and MLP', settings: 'Members chosen from the best three model types', result: 'CV 0.829, tied with boosting', weak: 'No gain here because all three make similar mistakes' }
  ],
  modelNotes: [
    { title: 'Bagging vs boosting in one breath', text: `Bagging trains trees in parallel on bootstrap samples and averages them, which lowers variance. Boosting trains small trees in sequence, each fixing the last one's errors, which lowers bias. Here the errors were mostly bias, so boosting won.` },
    { title: `Why trees don't need scaling`, text: `A tree only asks "is BMI above 30?". Rescaling BMI moves the threshold but not the split, so the result is the same. Distance models (k-NN), margin models (SVM) and gradient-trained models (logistic regression, MLP) do change with scale.` },
    { title: 'Why RBF did not beat linear', text: 'After one-hot encoding, a straight boundary already captures most of the signal. The kernel added cost but no accuracy.' }
  ],

  // ---------- 7. Evaluation ideas ----------
  conceptsIntro: `If they ask "what is X?", give the one-line definition, then say how you used it.`,
  cm: { TN: 4534, FP: 1829, FN: 1287, TP: 5075 },
  cmLines: [
    'Accuracy = (TP + TN) / all = 9,609 / 12,725 = 75.5%',
    `Recall / sensitivity / TPR = TP / (TP + FN) = 5,075 / 6,362 = 79.8% ("of the people with diabetes, how many did we catch?")`,
    `Precision = TP / (TP + FP) = 5,075 / 6,904 = 73.5% ("of the people we flagged, how many really have it?")`,
    'Specificity = TN / (TN + FP) = 71.3%. FPR = 1 − specificity = 28.7%',
    'F1 = the harmonic mean of precision and recall = 0.765'
  ],
  concepts: [
    { id: 'cm', name: 'Confusion matrix (Week 8)', text: 'A 2×2 table of truth vs prediction. Yours at 0.5: TN 4,534 · FP 1,829 · FN 1,287 · TP 5,075. Accuracy 75.5%, recall 79.8%, precision 73.5%, specificity 71.3%, FPR 28.7%, F1 0.765.' },
    { id: 'roc', name: 'ROC curve and AUC', text: 'Move the cut-off from 1 down to 0 and plot TPR against FPR at every point. AUC is the area under that curve. It is also the chance that a random person with diabetes gets a higher score than a random person without. 0.5 = guessing, 1.0 = perfect. Yours is 0.835. Why AUC: it doesn\'t depend on one cut-off, and for screening the ranking matters first.' },
    { id: 'tvt', name: 'Train / validation / test', text: 'Training data fits the model. Validation data (the CV folds) picks the settings. The test set is used once at the end for an honest score. Using the test set to pick settings would make its score too optimistic.' },
    { id: 'cv', name: 'Stratified k-fold CV', text: 'Split the development set into 5 parts with the same class mix. Train on 4, validate on 1, rotate 5 times, and average. Every row is validated once. It gives a mean and a spread (SD) instead of one lucky number.' },
    { id: 'bv', name: 'Bias-variance trade-off', text: 'High bias = too simple, misses patterns (a depth-2 tree, AUC 0.75). High variance = too complex, memorises noise (a depth-25 tree, training AUC 1.0 but validation 0.66). The best setting sits between them (depth about 7). See the depth curve.' },
    { id: 'gap', name: 'Overfitting gap', text: 'Training AUC minus validation AUC. Random forest 0.032 (most overfit), boosting 0.012, logistic regression 0.001 (almost none).' },
    { id: 'se', name: 'One-standard-error rule', text: 'Standard error = SD / √(number of folds) = 0.0030 / √5 = 0.0013. Models within that distance of the top score are inside fold noise, so treat them as tied, then pick the simplest. It stops you choosing a model by luck.' },
    { id: 'boot', name: 'Bootstrap 95% CI', text: 'Resample the 12,725 test rows with replacement 1,000 times, compute AUC each time, and take the 2.5th and 97.5th percentiles. This shows how much the test score could move by chance.' },
    { id: 'paired', name: 'Paired bootstrap', text: 'On each resample, score both models on the same people and record the difference. If the 95% interval of the difference includes 0, they are not really different.' },
    { id: 'leak', name: 'Pipeline / data leakage', text: 'Leakage = information from outside the training data getting into the model. Two kinds here: (1) a feature that encodes the answer (pid), and (2) preprocessing fitted on all the data before splitting. Pipelines prevent (2) by fitting the scaler inside each training fold.' },
    { id: 'perm', name: 'Permutation importance', text: 'Shuffle one column on the test set and measure the AUC drop. A big drop = the model relies on that feature. It works for any model.' },
    { id: 'cut', name: 'Cut-off (threshold)', text: 'The model gives a probability, and the cut-off turns it into yes/no. 0.5 maximises accuracy here. For screening, a missed case costs more than an extra test, so you can lower it. You picked 0.27 as the lowest cut-off keeping precision at 0.65 or above, chosen on out-of-fold development predictions, not the test set.' }
  ],

  // ---------- 8. Follow-up and tricky questions ----------
  followIntro: 'These are the "why" questions that separate Good from Excellent. Practise saying each answer out loud.',
  followups: [
    { n: 1, g: 'Data and preprocessing', q: `Why is pid a problem if it's just an ID?`, a: 'The file is sorted by class, so pid tells the model the answer. One split gives AUC 1.0. On real patients the IDs have no such order, so the model would fail.' },
    { n: 2, g: 'Data and preprocessing', q: 'How did you find the leak?', a: 'I plotted the diabetes rate against 20 bands of pid and saw a jump from 0 to 1. Then I confirmed it with a one-split tree.' },
    { n: 3, g: 'Data and preprocessing', q: 'Why keep duplicates?', a: 'With 21 coarse survey answers, two real people can answer identically. Deleting them would change the class patterns.' },
    { n: 4, g: 'Data and preprocessing', q: 'Why cap BMI instead of deleting outliers?', a: 'BMI above 60 is rare but possible, and those people are real high-risk cases. Capping keeps them but stops extreme values dominating distances and weights.' },
    { n: 5, g: 'Data and preprocessing', q: 'Why z-score and not min-max?', a: 'BMI has a long right tail, so min-max squashes most values near 0. Z-score handles that better, as I showed in AT2.' },
    { n: 6, g: 'Data and preprocessing', q: 'Why one-hot encode only for linear models?', a: `A linear model treats Age code 13 as "13 times" code 1, which forces a straight line. One-hot gives each band its own weight. Trees can split anywhere, so they don't need it.` },
    { n: 7, g: 'Data and preprocessing', q: `Why didn't you scale the 0/1 dummy columns?`, a: 'They are already on a 0 to 1 scale, and leaving them unscaled keeps their meaning.' },
    { n: 8, g: 'Data and preprocessing', q: 'Why did F3 (filter selection) hurt?', a: 'Mutual information judges each feature alone. HvyAlcoholConsump scores low alone but matters once age and BMI are known (heavy drinkers: 27.8% diabetes vs 51.0%). Filter methods miss conditional relevance.' },
    { n: 9, g: 'Data and preprocessing', q: 'Did you balance the classes?', a: `No need. They are already exactly 50/50. That's also why accuracy is a fair metric here.` },
    { n: 10, g: 'Tuning and selection', q: 'Grid search vs random search?', a: 'Grid tries every combination, which is good when there are few. Random samples a fixed number, which is better when there are many continuous settings (MLP, forest, boosting), because it covers the important ones faster.' },
    { n: 11, g: 'Tuning and selection', q: 'Why 5 folds and not 10?', a: `It's a good balance. Each fold still trains on about 40,700 rows, so the estimates are stable (SD about 0.003), and 10 folds would double the run time for little gain.` },
    { n: 12, g: 'Tuning and selection', q: 'Why stratified?', a: `It keeps the 50/50 class mix in every fold, so each fold's score is comparable.` },
    { n: 13, g: 'Tuning and selection', q: 'Why did k-NN need k = 201?', a: 'Most features are 0/1, so many people are at exactly the same distance. A small k gives noisy votes, and a large k smooths them.' },
    { n: 14, g: 'Tuning and selection', q: 'What does early stopping do in boosting?', a: 'It holds back 10% of the training data and stops adding trees when that score stops improving for 30 rounds. It stopped at 287 trees, which prevents overfitting.' },
    { n: 15, g: 'Tuning and selection', q: 'Why was the SVM trained on a sample?', a: 'Kernel SVM training time grows roughly with rows². Searching 12 settings × 5 folds on 50,000 rows was too slow. I re-scored the winner on the full data so the comparison is fair.' },
    { n: 16, g: 'Evaluation and results', q: 'Why ROC AUC and not accuracy?', a: `Both are fair here because the classes are balanced. AUC doesn't depend on one cut-off, and for screening the ranking matters most. I report accuracy too.` },
    { n: 17, g: 'Evaluation and results', q: `Soft voting scored higher on test. Why didn't you pick it?`, a: `0.8351 vs 0.8346 is a difference of 0.0005, and the paired bootstrap interval (−0.0014 to +0.0004) includes zero. So it's a tie, and my rule picks the simpler model. I also set the rule before looking at test results, so I couldn't cherry-pick.` },
    { n: 18, g: 'Evaluation and results', q: 'Why is test AUC higher than CV AUC?', a: `The final models were trained on all 50,897 development rows instead of about 40,700 per fold. More data gives slightly better models. It's not overfitting.` },
    { n: 19, g: 'Evaluation and results', q: 'Why are all the models so close?', a: 'The limit is the information in 21 self-reported answers, not the algorithm. Better results would need new data, like blood tests or family history.' },
    { n: 20, g: 'Evaluation and results', q: 'Why not use the test set to choose the cut-off?', a: 'Then the test score would no longer be honest. I chose it using out-of-fold predictions on the development set.' },
    { n: 21, g: 'Evaluation and results', q: 'Recall 79.8%: is that good?', a: 'It catches 4 in 5 people with diabetes. For screening, I\'d lower the cut-off to 0.27, which catches 93.9% at the cost of more false alarms.' },
    { n: 22, g: 'Evaluation and results', q: 'Which features matter most, and does that make sense?', a: 'GenHlth, BMI, Age, HighBP, HighChol. Yes, they match the known risk factors for type 2 diabetes, which suggests the model learned real patterns.' },
    { n: 23, g: 'Evaluation and results', q: 'Can the model say what causes diabetes?', a: 'No. The data is cross-sectional and self-reported. Some predictors, like HighBP, may be results of diabetes, not causes.' },
    { n: 24, g: 'Evaluation and results', q: 'Would it work on the real population?', a: 'It would rank people well, but the probabilities assume 50% prevalence. They would need recalibrating to about 14%.' },
    { n: 25, g: 'Evaluation and results', q: 'If you had more time, what would you do?', a: 'Nested cross-validation, probability calibration, a time budget per model, and saving progress from day one.' },
    { n: 26, g: 'Honesty', q: 'Did you use AI tools?', a: `Answer honestly and match what you declared. For example: "Yes, I used AI to help structure and simplify the code and the report. I ran every cell myself, checked the outputs, and I can explain every line." Then prove it by explaining any cell they point at.` },
    { n: 27, g: 'Honesty', q: 'Why does the notebook load results instead of running?', a: `"Colab disconnected during the 30-minute run, so each step saves to Drive. The code is exactly the same, and deleting the saved files reruns everything from scratch."` }
  ],

  // ---------- 9. AT2 ----------
  at2Intro: 'AT2 used your 3,000-row extract, so its numbers differ from AT3. Know the idea, one number, and how it linked to AT3.',
  at2: [
    { t: 'Attribute types', what: 'Nominal, ordinal, interval, ratio', did: 'BMI, MentHlth and PhysHlth are ratio. GenHlth, Age, Education and Income are ordinal. 14 binary flags + Sex are nominal', link: 'Ordinal codes were one-hot encoded for linear models' },
    { t: 'Equi-width binning', what: 'Equal-size intervals: (max − min) / bins', did: 'MentHlth/PhysHlth into 4 bins of 7.5 days. Very uneven: 84% in bin 1', link: 'Not used in AT3. The FreqDistress flags (≥ 14 days) do a similar job' },
    { t: 'Equi-depth binning', what: 'Bins with about equal counts (identical values stay together)', did: 'Bin 1 = all the zeros (2,018). Other bins about 310 to 360', link: 'Showed that zero-heavy counts need special handling' },
    { t: 'Smoothing', what: 'Replace values with the bin mean or nearest boundary', did: 'Bin mean lowered variance. Bin boundary raised it', link: 'Recommended equi-depth + bin mean' },
    { t: 'Min-max normalisation', what: '(v − min) / (max − min) to [0, 1]', did: 'BMI min 14, max 92: most values squashed below 0.20', link: 'Rejected because of the long BMI tail' },
    { t: 'Z-score normalisation', what: '(v − mean) / SD', did: 'Mean 30.04, SD 7.34. 39 records beyond |z| = 3', link: 'Used in AT3 (StandardScaler)' },
    { t: 'Decimal scaling', what: 'Divide by a power of 10', did: 'BMI / 100 gives 0.14 to 0.92', link: `Simple, doesn't centre the data` },
    { t: 'Discretisation', what: 'Number to categories', did: 'Age codes into 5 life stages. Boundaries fit the 5-year codes exactly', link: 'AT3 used WHO BMI bands (BMI_cat)' },
    { t: 'Binarisation', what: 'Category to 0/1 columns', did: 'Sex: one indicator (male = 1), since two one-hot columns are redundant', link: 'Same in AT3' },
    { t: 'Correlation', what: `Spearman (for ordinal/binary), chi-square + Cramer's V vs target`, did: 'Strongest: GenHlth V = 0.43, HighBP 0.38, BMI 0.36', link: `Same top features as AT3's permutation importance` },
    { t: 'Interaction', what: 'Two features together', did: 'HighBP + HighChol: 74.5% diabetes vs 22.6% with neither', link: 'Became the BP_Chol feature' },
    { t: 'Clustering', what: 'k-means on scaled data, PCA to plot', did: 'k = 4 by the elbow. A "healthy-looking but high-risk" cluster with 63% diabetes', link: 'Showed the classes overlap, which explains the AUC ceiling of about 0.83' },
    { t: 'Outliers', what: '1.5 × IQR and 3-SD rules', did: '96 BMI records above 45. Kept, because they are real', link: 'Kept again in AT3, capped at 60' }
  ],
  at2Questions: [
    { q: 'Why not min-max for BMI?', a: 'The maximum of 92 sets the scale, so most people are squashed below 0.2, and one new extreme value would change everyone\'s scale. Z-score keeps the spread meaningful.' },
    { q: `Why can't equi-depth bins be equal?`, a: '67% of MentHlth values are 0, and identical values must stay in the same bin, so the first bin is forced to be large.' },
    { q: 'Binning vs discretisation?', a: 'Binning groups values but keeps them quantitative (for example, smoothing with bin means). Discretisation turns them into categories (labels).' },
    { q: 'Why Spearman, not Pearson?', a: 'Most attributes are ordinal or binary, not normal, so a rank-based correlation fits better.' },
    { q: 'How did AT2 shape AT3?', a: 'Four direct links: drop pid, binarise Sex, z-score scaling, and the BP × Chol and risk-count interactions became new features.' }
  ],

  // ---------- 10. Practice plan + checklist ----------
  planIntro: 'Practise out loud, not just by reading. About 20 minutes a day for 5 days is enough.',
  plan: [
    { day: 1, text: 'Read sections 1 to 4. Say the 90-second story out loud 3 times with the notebook open' },
    { day: 2, text: 'Learn the numbers (section 3). Answer Q1 to Q5 out loud using the 3-layer method' },
    { day: 3, text: 'Walk through the notebook cell by cell (section 5) as if presenting. Time it: under 5 minutes' },
    { day: 4, text: 'Go through questions 1 to 27 in section 8 and the AT2 table. Mark any you hesitate on' },
    { day: 5, text: 'Full mock defence with Claude: it asks, you answer, it scores you Good or Excellent. (The Mock tab in this app does the same offline.)' }
  ],
  cram: [
    'Story: say the 90-second story out loud 3 times with the timer (Learn → 90-second story).',
    'Numbers: one pass of the Numbers flashcards; repeat the ones you missed.',
    'Official Q1 to Q5: practise each out loud with the 40-second timer, using all 3 layers.',
    'Notebook: scroll the notebook once and play the "Which cell?" quiz.',
    'Follow-ups: one pass of the 27 follow-up cards and the AT2 questions.',
    'Finish with a 10-question mock defence.'
  ],
  checklistNote: 'Your guide left this section blank, so these items are built only from the rules in your guide. Tick them off on the day.',
  checklist: [
    'Notebook open, already run, all outputs showing (all steps load from Drive in about a minute)',
    `Colab Table of contents open (list icon on the left) to jump between sections`,
    'Know where cells 10, 21, 49, 52, 54, 57, 59 and 63 are',
    'Say the 90-second story out loud once before going in',
    'Key numbers fresh: 0.829 CV, 0.835 test, 0.828 to 0.841 CI, 75.5% / 73.5% / 79.8%, 0.27 cut-off → 93.9% recall',
    'Use the 3-layer method: What → Evidence (number + cell) → Why / trade-off',
    `Point at the screen: "You can see it here in this cell."`,
    'Say numbers to 3 decimals (0.835, not 0.83462)',
    'Keep each answer under about 40 seconds, then stop',
    `If unsure: "I didn't test that, but my expectation is X because Y. I would check it by Z."`,
    'Never claim something the notebook does not show',
    'AI-use answer matches exactly what you declared'
  ]
};
