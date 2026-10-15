/* content-cards.js
   All flashcards. Each card links to one lesson (by lesson id) and has one topic:
   numbers | models | concepts | prep | at2 | rules
   Helpers (one card per line):
     Q(id, lesson, topic, question, answer, priority)          question and answer
     B(id, lesson, topic, "text with {{hidden}} part", priority) fill the blank
     X(id, lesson, topic, question, nameA, textA, nameB, textB) contrast pair
     S(id, lesson, topic, prompt, what, evidence, why)         say-it (3-layer answer)
   priority = true marks numbers that appear in the 90-second story or the 5 official answers.
   Number cards keep exact values (0.8346). Spoken answers round to 3 decimals (0.835).
   Keep ids the same when editing, because progress is saved by id. */
var CONTENT = window.CONTENT || (window.CONTENT = {});
(function () {
  var cards = [];
  function Q(id, lesson, cat, q, a, p) { cards.push({ id: id, lesson: lesson, cat: cat, type: 'qa', q: q, a: a, priority: !!p }); }
  function B(id, lesson, cat, text, p) { cards.push({ id: id, lesson: lesson, cat: cat, type: 'blank', text: text, priority: !!p }); }
  function X(id, lesson, cat, q, n1, t1, n2, t2) { cards.push({ id: id, lesson: lesson, cat: cat, type: 'contrast', q: q, pair: [{ name: n1, text: t1 }, { name: n2, text: t2 }] }); }
  function S(id, lesson, cat, q, what, evidence, why) { cards.push({ id: id, lesson: lesson, cat: cat, type: 'sayit', q: q, what: what, evidence: evidence, why: why }); }

  /* ---------- A. Big picture ---------- */
  B('task-1', 'task', 'concepts', "The target is {{Diabetes_binary}}: 1 = prediabetes or diabetes, 0 = no diabetes.");
  B('task-2', 'task', 'numbers', "The inputs are {{21}} answers from the BRFSS health survey.", true);
  Q('task-3', 'task', 'concepts', "What does BRFSS stand for?", "Behavioral Risk Factor Surveillance System, the health survey the data comes from.");

  Q('prob-1', 'problem-type', 'concepts', "What type of problem is this project?", "A supervised binary classification problem.");
  Q('prob-2', 'problem-type', 'concepts', "What does 'supervised' mean?", "The model learns from examples where the answer is already known.");
  Q('prob-3', 'problem-type', 'concepts', "What does 'binary' mean here?", "The target has only two classes: 1 or 0.");

  Q('crisp-1', 'crisp-dm', 'concepts', "Name the six CRISP-DM steps.", "Business understanding, data understanding, data preparation, modelling, evaluation, deployment.");
  B('crisp-2', 'crisp-dm', 'rules', "My one rule: any decision must be made {{without looking at the data that will later be used to test it}}.");
  Q('crisp-3', 'crisp-dm', 'concepts', "What is the memory trick for CRISP-DM?", "Big Dogs Prefer Meat, Every Day: Business, Data understanding, Preparation, Modelling, Evaluation, Deployment.");

  Q('scr-1', 'screening-auc', 'concepts', "What does screening mean in this project?", "Rank people by risk and invite the highest-risk people for a blood test.");
  B('scr-2', 'screening-auc', 'concepts', "AUC {{0.5}} means guessing. AUC {{1.0}} means perfect ranking.");
  S('scr-3', 'screening-auc', 'rules', "Why was ROC AUC your main measure?", "ROC AUC was my main measure, because I treated the model as a screening tool.", "Section 1 (cell 7) says so, and my best test AUC is 0.835.", "AUC measures ranking across every cut-off. For screening the ranking matters first, and the cut-off can be chosen later.");

  Q('mark-1', 'marking', 'rules', "What turns a Good (30) answer into an Excellent (40) answer?", "Adding the reason, a number from my results, and one trade-off.");
  B('mark-2', 'marking', 'rules', "A {{2 to 3}} sentence answer gets you to Good (30).");
  Q('mark-3', 'marking', 'rules', "What does the marker need to see for 40?", "An in-depth investigation: multiple classifiers, valid preprocessing, parameter optimisation, and model evaluation, then a defence of each choice.");

  Q('lay-1', 'three-layers', 'rules', "Name the 3 layers of an answer, in order.", "What, Evidence, Why / trade-off.");
  B('lay-2', 'three-layers', 'rules', "Layers 1 and 2 alone = {{Good}}. Adding layer 3 = {{Excellent}}.");
  Q('lay-3', 'three-layers', 'rules', "How long should one answer be, and when do you stop?", "About 40 seconds at most. Stop after layer 3 and let them ask the next question.");
  B('lay-4', 'three-layers', 'rules', "The Evidence layer gives {{a number and where it is in the notebook}}.");

  B('gold-1', 'golden-rules', 'rules', "If you don't know: 'I didn't test that, but my expectation is {{X because Y}}. I would check it by {{Z}}.'");
  Q('gold-2', 'golden-rules', 'rules', "How many decimals do you say numbers to?", "3 decimals: 0.835, not 0.83462.");
  Q('gold-3', 'golden-rules', 'rules', "What do you say while showing a cell?", "'You can see it here in this cell.' Always point at the screen.");
  Q('gold-4', 'golden-rules', 'rules', "What must you never do?", "Never claim something the notebook does not show.");

  B('data-1', 'data', 'numbers', "The file has {{63,622}} rows and {{23}} columns: pid, the target and 21 attributes.");
  B('data-2', 'data', 'numbers', "Each class has {{31,811}} rows, so the balance is exactly 50/50.");
  B('data-3', 'data', 'numbers', "Real diabetes prevalence in BRFSS is about {{14%}}, so the file was resampled.");
  B('data-4', 'data', 'numbers', "There are {{1,365}} duplicate rows ({{2.1%}}), ignoring pid. They were kept.");
  Q('data-5', 'data', 'numbers', "How many missing values are there?", "0.");

  /* ---------- B. Data preparation ---------- */
  B('pid-1', 'pid-leak', 'numbers', "A decision tree with one split on pid scored cross-validated AUC {{1.000}}.", true);
  Q('pid-2', 'pid-leak', 'prep', "How did you find the pid leak?", "I plotted the diabetes rate against 20 bands of pid and saw a jump from 0 to 1. Then a one-split tree on pid gave AUC 1.0.");
  Q('pid-3', 'pid-leak', 'prep', "Why is pid a problem if it's just an ID?", "Its values are sorted by class, so it tells the model the answer. On real patients the IDs have no such order, so the model would fail.");
  Q('pid-4', 'pid-leak', 'prep', "Is it right to say 'the file lists class 0 first'?", "No. Cell 6 shows the first rows are class 1. What is sorted by class is the pid value: up to about 35,345 is class 0.");

  B('split-1', 'split', 'numbers', "Development set: {{50,897}} rows ({{80%}}). Test set: {{12,725}} rows ({{20%}}).", true);
  Q('split-2', 'split', 'prep', "Why stratify the split?", "It keeps the 50/50 class balance in both parts.");
  B('split-3', 'split', 'numbers', "SEED = {{42}} is used everywhere, so every result can be repeated exactly.");

  Q('cv-1', 'cv', 'concepts', "How does stratified 5-fold CV work?", "Split the development set into 5 folds with the same class mix. Train on 4, validate on 1, rotate 5 times, and average.", true);
  B('cv-2', 'cv', 'numbers', "Each fold has about {{40,718}} rows to train and {{10,179}} to validate.");
  Q('cv-3', 'cv', 'concepts', "Why stratified folds?", "It keeps the 50/50 class mix in every fold, so each fold's score is comparable.");

  Q('pipe-1', 'pipelines', 'prep', "What are the two kinds of leakage in this project?", "A feature that encodes the answer (pid), and preprocessing fitted on all the data before splitting.");
  Q('pipe-2', 'pipelines', 'prep', "How do pipelines prevent leakage?", "Every step, like the scaler, is fitted on the training part of each fold only.");
  S('pipe-3', 'pipelines', 'rules', "Why did you use pipelines?", "All preprocessing is inside scikit-learn pipelines.", "steps_for in cell 19 builds the steps; every model in Section 4 uses them.", "In each fold the scaler is fitted on the training part only, so the validation part never leaks into its own preprocessing.");

  B('clean-1', 'cleaning', 'prep', "Sex was turned into one 0/1 column, with {{male = 1}}.");
  Q('clean-2', 'cleaning', 'prep', "Why only one column for Sex?", "Two values only need one 0/1 column.");
  Q('clean-3', 'cleaning', 'prep', "Why keep the duplicates?", "With 21 coarse survey answers, two real people can answer identically. Deleting them would change the class patterns.");

  B('bmi-1', 'bmi-cap', 'numbers', "{{231}} rows have BMI above {{60}}, up to {{98}}.");
  B('bmi-2', 'bmi-cap', 'prep', "BMI was capped at {{60}}, not deleted.", true);
  Q('bmi-3', 'bmi-cap', 'prep', "Why cap BMI instead of deleting outliers?", "BMI above 60 is rare but possible, and those people are real high-risk cases. Capping keeps them but stops extreme values dominating distances and weights.");

  X('scale-1', 'scaling', 'prep', "Min-max vs z-score", "Min-max", "(value − min) / (max − min). The maximum sets the scale, so a long tail squeezes most values into a narrow range.", "Z-score", "(value − mean) / SD. Mean 0, spread 1. Handles a long tail better. Used in AT3.");
  Q('scale-2', 'scaling', 'prep', "Why z-score and not min-max for BMI?", "BMI has a long right tail, so min-max squashes most values into a narrow range. Z-score handles that better, as I showed in AT2.");
  B('scale-3', 'scaling', 'prep', "The z-score scaler in scikit-learn is {{StandardScaler}}.");

  Q('who-1', 'who-scales', 'prep', "Which models got scaled inputs?", "k-NN, logistic regression, the MLP and the SVM.");
  Q('who-2', 'who-scales', 'prep', "Why don't trees need scaling?", "A tree only asks 'is BMI above 30?'. Rescaling BMI moves the threshold but not the split, so the result is the same.");
  X('who-3', 'who-scales', 'prep', "Scale vs no scale", "Needs scaling", "Distance (k-NN), margin (SVM) and gradient-trained models (logistic regression, MLP).", "No scaling", "Trees and tree ensembles: bagging, random forest, gradient boosting.");
  Q('who-4', 'who-scales', 'prep', "Why leave the 0/1 dummy columns unscaled?", "They are already on a 0 to 1 scale, and leaving them unscaled keeps their meaning.");

  Q('oh-1', 'one-hot', 'prep', "Which codes were one-hot encoded?", "GenHlth, Age, Income, Education and BMI_cat.");
  Q('oh-2', 'one-hot', 'prep', "Why one-hot encode only for linear models?", "A linear model treats Age code 13 as '13 times' code 1, which forces a straight line. One-hot gives each band its own weight. Trees can split anywhere.");
  B('oh-3', 'one-hot', 'numbers', "One-hot lifted logistic regression from {{0.8244}} (F1) to {{0.8261}} (F2).");

  B('feat-1', 'features', 'numbers', "add_features adds {{9}} new features and caps BMI at 60.", true);
  Q('feat-2', 'features', 'prep', "Name the 9 new features.", "BMI_clip, BMI_cat, CardioCount, BP_Chol, Age_BMI, Lifestyle, FreqPhysDistress, FreqMentDistress, PoorHealth.");
  Q('feat-3', 'features', 'prep', "Why are the new features safe inside a pipeline?", "They are row-wise: each uses only its own row's values.");

  B('fb-1', 'feat-bmi', 'prep', "BMI_cat uses the WHO bands: under {{18.5}}, 18.5–25, 25–30, 30–35, 35–40, {{40+}}.");
  Q('fb-2', 'feat-bmi', 'prep', "What is PoorHealth?", "A flag for GenHlth of 4 or 5: fair or poor self-rated health.");
  Q('fb-3', 'feat-bmi', 'prep', "What is BMI_clip, and what does it replace?", "BMI capped at 60. It replaces the original BMI column.");

  Q('fh-1', 'feat-heart', 'prep', "Which 4 flags add up to CardioCount?", "HighBP, HighChol, HeartDiseaseorAttack and Stroke.");
  B('fh-2', 'feat-heart', 'prep', "BP_Chol = {{HighBP × HighChol}}, because AT2 showed these two are much worse together.");
  Q('fh-3', 'feat-heart', 'prep', "Why make Age_BMI?", "Age × BMI_clip, because extra weight is more risky at older ages.");

  B('fx-1', 'feat-habits', 'prep', "Lifestyle = PhysActivity + Fruits + Veggies {{− Smoker − HvyAlcoholConsump}}.");
  B('fx-2', 'feat-habits', 'prep', "FreqPhysDistress and FreqMentDistress flag {{14}} or more bad days.");
  Q('fx-3', 'feat-habits', 'prep', "Where does the 14-day limit come from?", "The CDC definition of frequent distress.");

  Q('mi-1', 'mutual-info', 'concepts', "What does mutual information measure?", "How much one feature alone tells you about the target.");
  B('mi-2', 'mutual-info', 'numbers', "Features with mutual information below {{0.005}} were dropped in F3.");
  Q('mi-3', 'mutual-info', 'prep', "Name the 5 low mutual information features.", "NoDocbcCost, FreqMentDistress, HvyAlcoholConsump, MentHlth and AnyHealthcare.");

  Q('fs-1', 'feature-sets', 'prep', "What are the 4 feature sets?", "F0 raw, F1 + new features, F2 F1 + one-hot, F3 F1 without the 5 low-MI features.", true);
  B('fs-2', 'feature-sets', 'numbers', "The new features lifted k-NN from {{0.812}} to {{0.816}}.", true);
  B('fs-3', 'feature-sets', 'numbers', "Features and one-hot lifted logistic regression from {{0.823}} to {{0.826}}.", true);
  Q('fs-4', 'feature-sets', 'prep', "Which feature set does each model type use?", "Linear models (logistic regression, MLP, SVM) use F2. Trees, ensembles and k-NN use F1.");
  Q('fs-5', 'feature-sets', 'prep', "Why did the features barely change boosting?", "Boosted trees already find these interactions themselves.");

  B('f3-1', 'f3-trap', 'numbers', "F3 made gradient boosting worse: from {{0.8280}} to {{0.8264}}.");
  B('f3-2', 'f3-trap', 'numbers', "Heavy drinkers in AT3 data: {{27.8%}} diabetes, vs {{51.0%}} for everyone else.");
  Q('f3-3', 'f3-trap', 'prep', "Why did F3 (filter selection) hurt?", "Mutual information judges each feature alone. HvyAlcoholConsump scores low alone but matters once age and BMI are known. Filter methods miss conditional relevance.");

  /* ---------- C. Models (at least 4 cards each) ---------- */
  Q('base-1', 'baseline', 'models', "What does the majority-class baseline do?", "It always predicts the most common class.");
  B('base-2', 'baseline', 'numbers', "The majority-class baseline scores AUC {{0.5}}.", true);
  Q('base-3', 'baseline', 'models', "Why include a baseline?", "It shows the floor that every real model should beat.");
  Q('base-4', 'baseline', 'models', "Was the baseline scored on the test set?", "No. It was left out of the test-set table (cell 54). Its CV AUC is 0.5000.");

  Q('tree-1', 'tree', 'models', "How does a decision tree decide?", "It asks yes/no questions, choosing at each step the split that makes groups purest (Gini, or entropy = information gain, as in ID3).");
  B('tree-2', 'tree', 'models', "Best tree: {{entropy}}, depth {{8}}, min leaf {{200}}.");
  B('tree-3', 'tree', 'numbers', "Decision tree: CV AUC {{0.8158}}, test AUC {{0.8220}}.");
  Q('tree-4', 'tree', 'models', "What is the decision tree's weakness?", "Deep trees memorise the data (high variance). Unstable.");
  B('tree-5', 'tree', 'numbers', "The tree grid search tried {{70}} combinations.");

  Q('knn-1', 'knn', 'models', "How does k-NN decide?", "It finds the k most similar people and takes their majority.");
  B('knn-2', 'knn', 'models', "Best k-NN: k = {{201}}, {{uniform}} weights, {{Manhattan}} distance.");
  Q('knn-3', 'knn', 'models', "Why did k-NN need k = 201?", "Most features are 0/1, so many people are at exactly the same distance. A small k gives noisy votes, and a large k smooths them.");
  Q('knn-4', 'knn', 'models', "What is k-NN's weakness?", "Needs scaling. Slow to predict. Struggles with many 0/1 ties.");
  B('knn-5', 'knn', 'numbers', "k-NN: CV AUC {{0.8203}}, test AUC {{0.8265}}.");

  Q('lr-1', 'logreg', 'models', "How does logistic regression decide?", "A weighted sum of inputs passed through a sigmoid to get a probability. Linear boundary.");
  B('lr-2', 'logreg', 'models', "Best logistic regression: C = {{0.01}}, {{L2}} penalty.");
  B('lr-3', 'logreg', 'numbers', "Logistic regression: CV AUC {{0.8264}}, gap {{0.0007}} (said as 0.001), test {{0.8323}}.");
  Q('lr-4', 'logreg', 'models', "What is logistic regression's weakness?", "It can't find interactions unless you give them.");
  Q('lr-5', 'logreg', 'models', "What does a small C mean?", "Strong regularisation: weights are kept small.");

  Q('mlp-1', 'mlp', 'models', "How does an MLP decide?", "Layers of neurons. Each layer re-combines the last, so it can learn curved boundaries.");
  B('mlp-2', 'mlp', 'models', "Best MLP: one layer of {{64 tanh}} neurons, alpha {{0.062}}.");
  B('mlp-3', 'mlp', 'numbers', "MLP: CV AUC {{0.8270}}, test AUC {{0.8335}}.");
  Q('mlp-4', 'mlp', 'models', "What is the MLP's weakness?", "Black box. Depends on starting weights and scaling.");
  B('mlp-5', 'mlp', 'numbers', "The MLP random search tried {{16}} settings.");

  Q('svm-1', 'svm', 'models', "How does an SVM decide?", "It finds the boundary with the widest margin between classes. Kernels allow curved boundaries.");
  B('svm-2', 'svm', 'models', "Best SVM: {{linear}} kernel, C = {{0.01}}.");
  B('svm-3', 'svm', 'numbers', "SVM on the 10,000 sample: {{0.8323}}. On the full development set: {{0.8256}}.", true);
  Q('svm-4', 'svm', 'models', "What is the SVM's weakness?", "Training cost grows roughly with rows². Hard to explain.");
  B('svm-5', 'svm', 'numbers', "The SVM grid tried {{12}} settings on a {{10,000}}-row sample.", true);

  Q('bag-1', 'bagging', 'models', "How does bagging decide?", "Many trees, each on a bootstrap sample, then a vote (average).");
  B('bag-2', 'bagging', 'models', "Best bagging: {{30%}} samples, min leaf {{20}}, 50 trees.");
  B('bag-3', 'bagging', 'numbers', "Bagging: CV AUC {{0.8239}}, gap {{0.025}}, test {{0.8293}}.");
  Q('bag-4', 'bagging', 'models', "What is bagging's weakness?", "It lowers variance, not bias.");

  Q('rf-1', 'forest', 'models', "How is a random forest different from bagging?", "Each split looks at a random subset of features, so the trees differ more.");
  B('rf-2', 'forest', 'models', "Best forest: depth {{16}}, min leaf {{20}}, {{sqrt}} features, 300 trees.");
  B('rf-3', 'forest', 'numbers', "The random forest had the biggest overfitting gap: {{0.032}}.", true);
  Q('rf-4', 'forest', 'models', "What is the random forest's weakness?", "It still overfits. Large model.");
  B('rf-5', 'forest', 'numbers', "Random forest: CV AUC {{0.8254}}, test AUC {{0.8315}}.");

  Q('gb-1', 'boosting', 'models', "How does gradient boosting decide?", "It builds small trees one after another. Each new tree fixes the errors left so far.");
  B('gb-2', 'boosting', 'models', "Best boosting: learning rate {{0.033}}, {{23}} max leaves, min leaf {{290}}, L2 {{0.13}}, {{43%}} of features.");
  B('gb-3', 'boosting', 'numbers', "Gradient boosting CV AUC: {{0.8293}} ± {{0.0030}}.", true);
  B('gb-4', 'boosting', 'numbers', "Gradient boosting test AUC: {{0.8346}} (95% CI {{0.828 to 0.841}}).", true);
  B('gb-5', 'boosting', 'numbers', "Early stopping stopped boosting at {{287}} trees.");
  Q('gb-6', 'boosting', 'models', "What is gradient boosting's weakness?", "Many settings to tune. Can overfit without early stopping.");
  S('gb-7', 'boosting', 'rules', "Which method achieved the best performance?", "Gradient boosting.", "Highest CV AUC, 0.829 (cell 49), and test AUC 0.835 with 75.5% accuracy and 79.8% recall (cell 54).", "Soft voting was tied, but it is three models for no real gain, so by my one-standard-error rule I chose the simpler one.");

  Q('vote-1', 'voting', 'models', "How does soft voting decide?", "It averages the probabilities of boosting, logistic regression and the MLP.");
  B('vote-2', 'voting', 'numbers', "Soft voting: CV AUC {{0.8291}}, test AUC {{0.8351}}.");
  B('vote-3', 'voting', 'numbers', "Soft voting scored {{0.0005}} higher than boosting on test, but the paired interval includes zero.", true);
  Q('vote-4', 'voting', 'models', "Why did soft voting give no gain?", "All three models make similar mistakes. They lean on the same strong signals: general health, BMI, age and blood pressure.");
  Q('vote-5', 'voting', 'models', "Soft voting scored higher on test. Why didn't you pick it?", "0.8351 vs 0.8346 is a difference of 0.0005, and the paired interval (−0.0014 to +0.0004) includes zero. So it's a tie, and my rule, set before testing, picks the simpler model.");

  X('bvb-1', 'bag-vs-boost', 'models', "Bagging vs boosting", "Bagging", "Trees trained in parallel on bootstrap samples, then averaged. Lowers variance.", "Boosting", "Small trees trained in sequence, each fixing the last one's errors. Lowers bias.");
  Q('bvb-2', 'bag-vs-boost', 'models', "Why did boosting beat bagging and the random forest here?", "The errors were mostly bias, and boosting deals with bias directly.");
  B('bvb-3', 'bag-vs-boost', 'numbers', "Overfitting gaps: random forest {{0.032}}, bagging {{0.025}}, boosting {{0.012}}.");

  Q('rbf-1', 'rbf-linear', 'models', "Why did the RBF kernel not beat linear?", "After one-hot encoding, a straight boundary already captures most of the signal. The kernel added cost but no accuracy.");
  B('rbf-2', 'rbf-linear', 'models', "Logistic regression and the linear SVM both picked C = {{0.01}}.");
  X('rbf-3', 'rbf-linear', 'models', "Linear kernel vs RBF kernel", "Linear", "A straight boundary. Won here, with C = 0.01.", "RBF", "A curved, local boundary (gamma sets how local). Added time, no accuracy.");

  Q('map-1', 'model-map', 'models', "Which tuned model was worst?", "The decision tree: CV 0.816, test 0.822.");
  B('map-2', 'model-map', 'numbers', "All nine tuned models were within {{0.013}} AUC on test.", true);
  Q('map-3', 'model-map', 'models', "What does the small spread between models tell you?", "The limit comes from the data, not the algorithm.");
  Q('map-4', 'model-map', 'models', "Top three models by CV AUC?", "Gradient boosting 0.8293, soft voting 0.8291, MLP 0.8270.");

  /* ---------- D. Tuning ---------- */
  Q('tune-1', 'tune-fn', 'concepts', "What does tune() keep the same for every model?", "The same 5 folds (cv=cv) and the same metric (scoring='roc_auc').");
  Q('tune-2', 'tune-fn', 'concepts', "Which three numbers does tune() record?", "The CV AUC, its spread (SD), and the training AUC.");
  B('tune-3', 'tune-fn', 'concepts', "tune() reads the training AUC from {{mean_train_score}} at the {{best_index_}}.");

  X('gr-1', 'grid-random', 'concepts', "Grid search vs random search", "Grid search", "Tries every combination. Good when there are few settings.", "Random search", "Samples a fixed number. Better when there are many continuous settings, because it covers the important ones faster.");
  Q('gr-2', 'grid-random', 'concepts', "Which models used random search?", "The MLP (16), random forest (14) and gradient boosting (25).");
  B('gr-3', 'grid-random', 'numbers', "Grid sizes: tree {{70}}, k-NN {{20}}, logistic regression {{10}}, SVM {{12}}, bagging {{9}}.");

  B('gap-1', 'gap', 'numbers', "Gaps: random forest {{0.032}}, boosting {{0.012}}, logistic regression {{0.001}}.", true);
  Q('gap-2', 'gap', 'concepts', "How is the overfitting gap calculated?", "Training AUC minus validation AUC.");
  Q('gap-3', 'gap', 'concepts', "Why did boosting keep a small gap?", "A low learning rate, big leaves and early stopping.");

  X('bv-1', 'bias-variance', 'concepts', "High bias vs high variance", "High bias", "Too simple, misses patterns. Example: a depth-2 tree, AUC about 0.75.", "High variance", "Too complex, memorises noise. Example: a depth-25 tree, training AUC 1.0 but validation 0.66.");
  B('bv-2', 'bias-variance', 'numbers', "On the depth curve, validation AUC peaks at depth {{7}} with {{0.815}}.", true);
  B('bv-3', 'bias-variance', 'numbers', "At depth 25, validation AUC falls to {{0.659}} while training AUC reaches {{1.0}}.", true);
  S('bv-4', 'bias-variance', 'rules', "How did you check the bias-variance trade-off?", "I plotted a validation curve for the decision tree's depth.", "Validation AUC peaks around depth 7 and falls to 0.66 at depth 25, while training AUC goes to 1.0 (cell 31).", "That is the bias-variance trade-off: too shallow misses patterns, too deep memorises noise, so the best depth sits between.");

  B('es-1', 'early-stopping', 'numbers', "Early stopping holds back {{10%}} and stops after {{30}} rounds with no improvement.");
  B('es-2', 'early-stopping', 'numbers', "Boosting stopped at {{287}} trees, out of a maximum of 1,000.");
  Q('es-3', 'early-stopping', 'concepts', "What does early stopping do in boosting?", "It stops adding trees when the held-back score stops improving, which prevents overfitting.");

  B('trap-1', 'svm-trap', 'numbers', "The SVM's sample score was {{0.8323}} with a large SD of {{0.0103}}.", true);
  Q('trap-2', 'svm-trap', 'concepts', "Why re-score the SVM on the full data?", "The sample score was noisy and would have wrongly ranked the SVM first. Re-scoring on the full data makes the comparison fair.");
  Q('trap-3', 'svm-trap', 'concepts', "Why was the SVM searched on a sample at all?", "Kernel SVM training time grows roughly with rows². 12 settings × 5 folds on 50,000 rows was too slow.");

  Q('fold-1', 'folds', 'concepts', "Why 5 folds and not 10?", "Each fold still trains on about 40,700 rows, so estimates are stable (SD about 0.003). 10 folds would double the run time for little gain.");
  B('fold-2', 'folds', 'numbers', "Fold scores were stable, with an SD of about {{0.003}}.");
  B('fold-3', 'folds', 'numbers', "With 5 folds, each fold still trains on about {{40,700}} rows.");

  /* ---------- E. Evaluation ---------- */
  B('cm-1', 'confusion', 'numbers', "Top row (actually no): TN {{4,534}}, FP {{1,829}}.");
  B('cm-2', 'confusion', 'numbers', "Bottom row (actually yes): FN {{1,287}}, TP {{5,075}}.");
  Q('cm-3', 'confusion', 'concepts', "What is a false negative in this project?", "A person with diabetes the model missed.");

  B('ar-1', 'acc-recall', 'numbers', "Accuracy = (TP + TN) / all = 9,609 / 12,725 = {{75.5%}}.", true);
  B('ar-2', 'acc-recall', 'numbers', "Recall = TP / (TP + FN) = 5,075 / 6,362 = {{79.8%}}.", true);
  Q('ar-3', 'acc-recall', 'concepts', "Why is accuracy a fair measure here?", "The classes are exactly balanced, 50/50.");
  Q('ar-4', 'acc-recall', 'concepts', "Recall 79.8%: is that good?", "It catches 4 in 5 people with diabetes. For screening, I'd lower the cut-off to 0.27, which catches 93.9% at the cost of more false alarms.");

  B('psf-1', 'prec-spec-f1', 'numbers', "Precision = TP / (TP + FP) = 5,075 / 6,904 = {{73.5%}}.");
  B('psf-2', 'prec-spec-f1', 'numbers', "Specificity = TN / (TN + FP) = {{71.3%}}. FPR = {{28.7%}}.");
  B('psf-3', 'prec-spec-f1', 'numbers', "F1, the harmonic mean of precision and recall, is {{0.765}}.");

  X('pvr-1', 'prec-vs-recall', 'concepts', "Precision vs recall", "Precision", "Of the people flagged, how many really have it? TP / (TP + FP). 73.5% at 0.5.", "Recall", "Of the people who have it, how many were caught? TP / (TP + FN). 79.8% at 0.5.");
  Q('pvr-2', 'prec-vs-recall', 'concepts', "What happens when you lower the cut-off?", "More people are flagged: recall goes up and precision goes down.");
  B('pvr-3', 'prec-vs-recall', 'numbers', "At 0.27: recall {{93.9%}}, precision {{65.4%}}.", true);

  Q('roc-1', 'roc-auc', 'concepts', "What is plotted on a ROC curve?", "True positive rate against false positive rate, at every cut-off from 1 down to 0.");
  Q('roc-2', 'roc-auc', 'concepts', "What does AUC mean as a chance?", "The chance a random person with diabetes gets a higher score than a random person without.");
  B('roc-3', 'roc-auc', 'numbers', "The best model's test AUC is {{0.8346}}, said as 0.835.", true);

  X('tvt-1', 'train-val-test', 'concepts', "Validation vs test", "Validation", "The CV folds. Used to pick the settings.", "Test", "Kept aside from the start. Used once at the end for an honest score.");
  Q('tvt-2', 'train-val-test', 'concepts', "Why use the test set only once?", "Using it to pick settings would make its score too optimistic.");
  Q('tvt-3', 'train-val-test', 'concepts', "What is training data used for?", "Fitting the model.");

  B('boot-1', 'bootstrap-ci', 'numbers', "The CIs come from {{1,000}} bootstrap samples of the test set.", true);
  B('boot-2', 'bootstrap-ci', 'numbers', "Boosting's 95% CI for test AUC is {{0.828 to 0.841}}.");
  Q('boot-3', 'bootstrap-ci', 'concepts', "How is the 95% CI taken from the bootstrap?", "Compute AUC on each of the 1,000 resamples, then take the 2.5th and 97.5th percentiles.");

  Q('pair-1', 'paired', 'concepts', "What makes the bootstrap test 'paired'?", "Both models are scored on the same resampled people each time, and the difference is recorded.");
  B('pair-2', 'paired', 'numbers', "Boosting vs soft voting: paired interval {{−0.0014 to +0.0004}}, which includes zero.", true);
  Q('pair-3', 'paired', 'concepts', "Which models are not significantly different from boosting?", "Soft voting and the MLP. Boosting beats the other 6.");
  B('pair-4', 'paired', 'numbers', "Boosting beats logistic regression by {{0.0023}} (interval {{0.0007 to 0.0040}}).");

  B('se-1', 'one-se', 'numbers', "SE = 0.0030 / √5 = {{0.0013}}, so the tie band is CV AUC ≥ {{0.828}}.");
  Q('se-2', 'one-se', 'concepts', "Which models were tied by the one-standard-error rule?", "Gradient boosting and soft voting.");
  Q('se-3', 'one-se', 'concepts', "Why set the rule before testing?", "So I couldn't cherry-pick a model from the test results.");
  S('se-4', 'one-se', 'rules', "Why boosting and not soft voting?", "I chose gradient boosting because it tied with soft voting and is simpler.", "Soft voting was only 0.0005 higher on test, and the paired interval includes zero (cell 57).", "My rule, set before testing: anything within one standard error of the top CV score is a tie, then choose the simplest. Boosting is one model instead of three.");

  Q('tc-1', 'test-vs-cv', 'concepts', "Why is test AUC higher than CV AUC?", "The final models were trained on all 50,897 development rows instead of about 40,700 per fold. More data gives slightly better models. It's not overfitting.");
  B('tc-2', 'test-vs-cv', 'numbers', "Test AUCs are about {{0.005}} higher than CV AUCs.");
  Q('tc-3', 'test-vs-cv', 'concepts', "Why are all the models so close?", "The limit is the information in 21 self-reported answers, not the algorithm. Better results would need new data, like blood tests or family history.");

  /* ---------- F. Interpreting ---------- */
  Q('perm-1', 'permutation', 'concepts', "How does permutation importance work?", "Shuffle one column on the test set and measure the AUC drop. A big drop means the model relies on it.");
  B('perm-2', 'permutation', 'numbers', "Top 5 drops in AUC: GenHlth {{0.0575}}, BMI {{0.0377}}, Age {{0.0259}}, HighBP {{0.0184}}, HighChol {{0.0112}}.");
  Q('perm-3', 'permutation', 'concepts', "Do the top features make sense?", "Yes. GenHlth, BMI, Age, HighBP and HighChol match the known risk factors for type 2 diabetes, so the model learned real patterns.");

  B('cut-1', 'cutoff', 'concepts', "The cut-off rule: the lowest cut-off that keeps precision at {{0.65}} or above.");
  B('cut-2', 'cutoff', 'numbers', "Cut-off {{0.27}} gives recall {{93.9%}}, precision {{65.4%}}, accuracy {{72.1%}}.", true);
  Q('cut-3', 'cutoff', 'concepts', "Why not use the test set to choose the cut-off?", "Then the test score would no longer be honest. I chose it using out-of-fold predictions on the development set.");
  B('cut-4', 'cutoff', 'numbers', "The exact chosen cut-off printed in cell 63 is {{0.273}}.");

  B('refit-1', 'refit', 'numbers', "The final model is refit on all {{63,622}} rows.");
  Q('refit-2', 'refit', 'concepts', "After the refit, which score is the honest estimate?", "The test AUC, 0.8346 (said as 0.835).");
  Q('refit-3', 'refit', 'concepts', "Why refit on all rows?", "So the final model learns from as much data as possible.");

  Q('lim-1', 'limits', 'concepts', "Can the model say what causes diabetes?", "No. The data is cross-sectional and self-reported. Some predictors, like HighBP, may be results of diabetes, not causes.");
  B('lim-2', 'limits', 'numbers', "The probabilities assume {{50%}} prevalence and need recalibrating to about {{14%}}.");
  Q('lim-3', 'limits', 'concepts', "If you had more time, what would you do?", "Nested cross-validation, probability calibration, a time budget per model, and saving progress from day one.");

  /* ---------- G. AT2 ---------- */
  X('at2t-1', 'at2-types', 'at2', "Nominal vs ordinal", "Nominal", "Labels with no order. In AT2: the 14 binary flags and Sex.", "Ordinal", "Ordered categories with unequal gaps. In AT2: GenHlth, Age, Education, Income.");
  Q('at2t-2', 'at2-types', 'at2', "Which attributes are ratio?", "BMI, MentHlth and PhysHlth.");
  Q('at2t-3', 'at2-types', 'at2', "How did attribute types shape AT3?", "The ordinal codes were one-hot encoded for linear models.");

  X('at2b-1', 'at2-binning', 'at2', "Equi-width vs equi-depth binning", "Equi-width", "Equal-size intervals: (max − min) / bins. MentHlth: 4 bins of 7.5 days, 84% in bin 1.", "Equi-depth", "About equal counts, identical values together. MentHlth bin 1 = all 2,018 zeros.");
  B('at2b-2', 'at2-binning', 'at2', "Equi-width put {{84%}} of MentHlth values in bin 1.");
  B('at2b-3', 'at2-binning', 'at2', "In equi-depth binning, MentHlth bin 1 held all {{2,018}} zeros; the others held {{309, 313 and 360}}.");
  Q('at2b-4', 'at2-binning', 'at2', "What did each smoothing method do to variance?", "Bin mean lowered variance. Bin boundary raised it.");
  Q('at2b-5', 'at2-binning', 'at2', "Why can't equi-depth bins be equal?", "67% of MentHlth values are 0, and identical values must stay in the same bin, so the first bin is forced to be large.");

  X('at2n-1', 'at2-normalise', 'at2', "Min-max vs z-score on AT2 BMI", "Min-max", "(v − 14) / 78 for BMI 14 to 92. About half of values below 0.20.", "Z-score", "(v − 30.04) / 7.34. 39 records beyond |z| = 3. Extremes stay visible.");
  B('at2n-2', 'at2-normalise', 'at2', "AT2 BMI z-score: mean {{30.04}}, SD {{7.34}}, {{39}} records beyond |z| = 3.");
  B('at2n-3', 'at2-normalise', 'at2', "Decimal scaling BMI / 100 gives {{0.14 to 0.92}}, but does not centre the data.");
  Q('at2n-4', 'at2-normalise', 'at2', "Why not min-max for BMI?", "The maximum of 92 sets the scale, so most people are squashed into a narrow range, and one new extreme value would change everyone's scale. Z-score keeps the spread meaningful.");

  X('at2d-1', 'at2-discretise', 'at2', "Binning vs discretisation", "Binning", "Groups values but keeps them quantitative, for example smoothing with bin means.", "Discretisation", "Turns values into categories (labels), for example Age codes into 5 life stages.");
  B('at2d-2', 'at2-discretise', 'at2', "AT2 grouped Age codes into {{5}} life stages, with boundaries that fit the 5-year codes exactly.");
  B('at2d-3', 'at2-discretise', 'at2', "Across the age stages, the diabetes rate rose from {{4.65%}} to {{62.34%}}.");
  Q('at2d-4', 'at2-discretise', 'at2', "Why only one indicator for Sex?", "Two one-hot columns are exact opposites, so one is redundant. Male = 1.");

  X('at2c-1', 'at2-correlation', 'at2', "Spearman vs Pearson", "Spearman", "Rank-based. Fits ordinal or binary data. Used in AT2.", "Pearson", "Measures straight-line links between normal numbers. Not suited to most of these attributes.");
  B('at2c-2', 'at2-correlation', 'at2', "Strongest Cramér's V: GenHlth {{0.43}}, HighBP {{0.38}}, BMI {{0.36}}.");
  B('at2c-3', 'at2-correlation', 'at2', "HighBP + HighChol: {{74.5%}} diabetes, vs {{22.6%}} with neither.");
  Q('at2c-4', 'at2-correlation', 'at2', "How many risk factors did the AT2 count use, and how many does CardioCount use?", "AT2 counted 6 (including Smoker and DiffWalk). CardioCount uses 4: HighBP, HighChol, HeartDiseaseorAttack, Stroke.");

  B('at2k-1', 'at2-clusters', 'at2', "k-means chose k = {{4}} by the elbow method.");
  B('at2k-2', 'at2-clusters', 'at2', "The healthy-looking but high-risk cluster had {{1,107}} records ({{37%}}) and {{63%}} diabetes.");
  Q('at2k-3', 'at2-clusters', 'at2', "How does the AT2 clustering explain AT3's results?", "The classes overlap, which explains the AUC ceiling of about 0.83.");

  B('at2o-1', 'at2-outliers', 'at2', "The 1.5 × IQR rule flagged {{96}} BMI records above {{45}}.");
  B('at2o-2', 'at2-outliers', 'at2', "The 3-SD rule flagged {{39}} BMI records.");
  Q('at2o-3', 'at2-outliers', 'at2', "Why were BMI outliers kept in AT2?", "They are real: a BMI of 92 is extreme but possible, and these people were high-risk (72.9% diabetes).");
  Q('at2o-4', 'at2-outliers', 'at2', "How were BMI outliers handled in AT3?", "Kept again, but BMI was capped at 60.");

  Q('a23-1', 'at2-to-at3', 'at2', "Name the four direct links from AT2 to AT3.", "Drop pid, binarise Sex, z-score scaling, and the BP × Chol and risk-count interactions became new features.");
  Q('a23-2', 'at2-to-at3', 'at2', "Which AT2 idea did not carry over well?", "Filtering out weak features: in F3 it removed HvyAlcoholConsump and made boosting worse.");
  Q('a23-3', 'at2-to-at3', 'at2', "Which AT3 features came from AT2 interactions?", "BP_Chol and CardioCount.");

  /* ---------- H. Honest answers ---------- */
  Q('ai-1', 'ai-tools', 'rules', "Did you use AI tools? What must the answer match?", "Exactly what you declared. Answer honestly.");
  Q('ai-2', 'ai-tools', 'rules', "How do you prove you understand the code?", "Explain any cell they point at, line by line.");
  B('ai-3', 'ai-tools', 'rules', "Guide example: 'I ran {{every cell myself}}, checked the outputs, and I can explain {{every line}}.'");

  Q('sv-1', 'saved-results', 'rules', "Why does the notebook load results instead of running?", "Colab disconnected during the 30-minute run, so each step saves to Drive. The code is exactly the same, and deleting the saved files reruns everything.");
  B('sv-2', 'saved-results', 'rules', "The saving function in cell 4 is {{checkpoint(name, make)}}.");
  Q('sv-3', 'saved-results', 'rules', "What should you do with the notebook before the exam?", "Run it once, so every step loads quickly. In the saved copy, cells 44 and 45 ran live (713 s and 450 s).");

  /* ---------- Number story ---------- */
  B('ns-1', 'number-story', 'numbers', "Big three: CV {{0.829}}, test {{0.835}}, cut-off {{0.27}}.", true);
  B('ns-2', 'number-story', 'numbers', "Story order: data → {{split}} → features → {{tuning}} → results → {{cut-off}}.");
  B('ns-3', 'number-story', 'numbers', "The 0.27 cut-off lifts recall from {{79.8%}} to {{93.9%}}.", true);

  /* ---------- Official questions as Say-it cards ---------- */
  S('off-1', 'model-map', 'rules', "Q1. What classification methods did you use?", "One model for every method from Weeks 7 to 11: decision tree, k-NN, logistic regression, MLP, SVM, bagging, random forest, gradient boosting and soft voting, plus a majority-class baseline at AUC 0.5.", "Section 4 headings, then the CV results table (cell 49).", "They cover different ideas on purpose, and all nine were within 0.013 AUC, which tells me the limit comes from the data, not the algorithm.");
  S('off-3', 'pid-leak', 'rules', "Q3. Did you apply any data preprocessing?", "I dropped pid, turned Sex into 0/1, capped BMI at 60, added 9 new features, one-hot encoded ordinal codes for linear models, and z-score scaled inputs.", "One split on pid gives AUC 1.0 (cell 10). Features lifted k-NN from 0.812 to 0.816 (cell 21).", "All of this sits inside pipelines, so validation never leaks into its own preprocessing. Features barely changed boosting, because trees find interactions themselves.");
  S('off-4', 'grid-random', 'rules', "Q4. How did you set the hyper-parameters?", "GridSearchCV for few settings, RandomizedSearchCV for many, all with the same stratified 5-fold CV and ROC AUC.", "Random forest gap 0.032, boosting 0.012 (cell 49). Depth curve peaks around 7 and falls to 0.66 at depth 25 (cell 31).", "The SVM was searched on 10,000 rows for speed but re-scored on full data, because the sample score of 0.832 was noisy.");
  S('off-5', 'roc-auc', 'rules', "Q5. How did you evaluate and compare the classifiers?", "Same 5 folds and ROC AUC for every model, then one score each on a 20% test set kept aside from the start.", "1,000 bootstrap samples for 95% CIs (cell 54) and a paired bootstrap (cell 57).", "AUC fits screening because it covers every cut-off. A cut-off of 0.27, chosen on development predictions, lifts recall from 79.8% to 93.9%.");

  CONTENT.cards = cards;
})();
