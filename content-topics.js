/* content-topics.js
   Every topic answers the same simple questions, in the same order:
     what     What is it?           (plain words, from the course knowledge base)
     example  An everyday example
     why      Why did I use it?     (my project)
     got      What did I get?       (my results, with numbers)
     show     Show it in the notebook: cell numbers + a code step id from content-code.js
     say      Say it in the exam     (What, Evidence, Why)
     remember One line to remember
     check    3 quick questions to test yourself
   Keep ids the same when editing, because progress is saved by id. */
var CONTENT = window.CONTENT || (window.CONTENT = {});

CONTENT.groups = [
  { id: 'start', title: 'Start here' },
  { id: 'data', title: '1. The data' },
  { id: 'prep', title: '2. Preparing the data' },
  { id: 'models', title: '3. The models' },
  { id: 'tuning', title: '4. Tuning the models' },
  { id: 'results', title: '5. Results' },
  { id: 'at2', title: '6. AT2 (preprocessing)' }
];

CONTENT.topics = [
/* ================= START HERE ================= */
{ id: 'project', group: 'start', title: 'My project in one minute',
  what: ['A **supervised binary classification** project: the model learns from people whose answer is known, then predicts yes or no for new people.'],
  example: 'Like a teacher marking practice tests with the answers, so you can answer a new test on your own.',
  why: ['The task was to predict **Diabetes_binary** (1 = prediabetes or diabetes, 0 = no) from **21 BRFSS survey answers**.',
        'I treated it as a **screening tool**: rank people by risk and invite the highest-risk people for a blood test.'],
  got: ['Best model: **gradient boosting**, CV AUC **0.829**, test AUC **0.835**.',
        'All 9 tuned models were within **0.013** AUC of each other, so the data, not the algorithm, sets the limit.'],
  show: { cells: [0, 7], point: 'The first cell lists the 8 sections. Cell 7 states the problem and the main measure, ROC AUC.' },
  say: 'My task was to predict Diabetes_binary from 21 BRFSS survey answers. It is a supervised binary classification problem, and I treated it as a screening tool, so my main metric was ROC AUC.',
  remember: '1 target, 21 answers, 2 classes, 1 goal: screening.',
  check: [
    { q: 'What is the target?', a: 'Diabetes_binary: 1 = prediabetes or diabetes, 0 = no diabetes.' },
    { q: 'What kind of problem is it?', a: 'Supervised binary classification.' },
    { q: 'What was the best model and its test AUC?', a: 'Gradient boosting, test AUC 0.835.' }
  ] },

{ id: 'marking', group: 'start', title: 'How I am marked (and how to answer)',
  what: ['Each answer has 3 layers. **What** (1 sentence), **Evidence** (a number and where it is in the notebook), **Why / trade-off** (1 to 2 sentences).',
         'What + Evidence = **Good (30)**. Adding Why = **Excellent (40)**. Stop after about 40 seconds.'],
  example: 'Like a lawyer: state the claim, show the proof, explain why the other option is worse.',
  why: ['The marker wants an in-depth investigation: many classifiers, valid preprocessing, real tuning and proper evaluation, **and** the reason for each choice.'],
  got: ['My evidence: 9 methods + a baseline, the pid leak found, 4 feature sets tested, grid/random search with 5-fold CV, a test set with bootstrap CIs and a paired test.'],
  show: { cells: [], point: 'Golden rules: point at the screen ("You can see it here in this cell"), say numbers to 3 decimals, never claim what the notebook does not show.' },
  say: 'Gradient boosting performed best. CV AUC 0.829 and test AUC 0.835, shown in Section 4 and Section 6. Soft voting was tied, but it is three models for no real gain, so by my one-standard-error rule I chose the simpler one.',
  remember: 'What → Evidence → Why. If unsure: "I didn\'t test that, but my expectation is X because Y. I would check it by Z."',
  check: [
    { q: 'What are the 3 layers?', a: 'What, Evidence (a number and where it is), Why / trade-off.' },
    { q: 'What does adding the Why layer earn you?', a: 'Excellent (40) instead of Good (30).' },
    { q: 'Say the fallback sentence.', a: 'I didn\'t test that, but my expectation is X because Y. I would check it by Z.' }
  ] },

/* ================= 1. THE DATA ================= */
{ id: 'data', group: 'data', title: 'The data',
  what: ['A dataset is a table. Each **row** is a person (a record). Each **column** is an attribute. The column you predict is the **target**.',
         '**Prevalence** is how common a condition is in the real population.'],
  example: 'A class register: one row per student, one column per question.',
  why: ['Before modelling, I checked for missing values, duplicates and class balance, because a model is only as good as its data.'],
  got: ['**63,622** rows, **23** columns (pid + target + 21 attributes). **0** missing values.',
        'Classes exactly **50/50**: 31,811 each. Real prevalence is about **14%**, so the file was resampled.',
        '**1,365** duplicates (2.1%), kept, because two real people can give the same 21 answers.'],
  show: { cells: [8], code: 'datacheck', point: 'Missing values: 0 · Duplicate rows: 1365 · 31811 in each class.' },
  say: 'There are no missing values, 1,365 duplicates that I kept, and the classes are exactly 50/50. Real prevalence is about 14%, so the file was resampled.',
  remember: '63,622 = 31,811 + 31,811.',
  check: [
    { q: 'How many rows and columns?', a: '63,622 rows and 23 columns.' },
    { q: 'Why keep the duplicates?', a: 'With 21 coarse survey answers, two real people can answer identically.' },
    { q: 'What is real diabetes prevalence?', a: 'About 14%. The file is 50/50 because it was resampled.' }
  ] },

{ id: 'pid', group: 'data', title: 'The pid leak',
  what: ['**Target leakage** is when an input secretly contains the answer. The model looks perfect but learns nothing useful.'],
  example: 'A student who sees the answer sheet scores 100% but has learned nothing.',
  why: ['pid is just an ID, but its values are **sorted by class**: low pids are all class 0, high pids are all class 1.',
        'On real patients, IDs have no such order, so a model using pid would fail.'],
  got: ['I plotted the diabetes rate against 20 bands of pid: it jumps from 0 to 1.',
        'A tree with **one split on pid** scored AUC **1.000**. So I **dropped pid**.'],
  show: { cells: [10], code: 'pidleak', point: 'The plot jumping from 0 to 1, and "AUC using only pid: 1.0".' },
  say: 'I found that pid leaks the label: low pids are all class 0, high pids are all class 1. One split on pid gives AUC 1.0, so I dropped it.',
  remember: 'One split, perfect score = leak.',
  check: [
    { q: 'Why is pid a problem if it is just an ID?', a: 'Its values are sorted by class, so it gives away the answer.' },
    { q: 'How did you find the leak?', a: 'I plotted the diabetes rate against 20 bands of pid, then confirmed with a one-split tree (AUC 1.0).' },
    { q: 'What is target leakage?', a: 'An input that secretly contains the answer.' }
  ] },

{ id: 'split', group: 'data', title: 'Train/test split',
  what: ['The **test set** is data locked away and used **once** at the end, for an honest score.',
         'The **development set** is everything else, used to build and tune.',
         '**Stratify** keeps the same class mix in both parts.'],
  example: 'Practice questions (development) vs the sealed final exam (test). If you saw the exam paper while practising, your score would mean nothing.',
  why: ['So the final score is honest: no setting is chosen by looking at the test data.'],
  got: ['Development **50,897** rows (80%), test **12,725** rows (20%), stratified, seed **42**.'],
  show: { cells: [14], code: 'split', point: 'Development set: (50897, 21) · Test set: (12725, 21).' },
  say: 'I held out 20% as a test set and did everything else on the other 80%. Stratify keeps the 50/50 balance in both parts. The test set is touched only once, in Section 6.',
  remember: 'Test set = the sealed exam envelope. Open it once.',
  check: [
    { q: 'How big are the two parts?', a: 'Development 50,897 (80%), test 12,725 (20%).' },
    { q: 'Why stratify?', a: 'To keep the 50/50 class balance in both parts.' },
    { q: 'When is the test set used?', a: 'Once, at the end, in Section 6.' }
  ] },

{ id: 'cv', group: 'data', title: 'Cross-validation (5-fold)',
  what: ['**Cross-validation** splits the data into k parts (**folds**). Train on k−1, check on the one left out, rotate, and average.',
         'Every row is checked once. You get an average and a spread, not one lucky number.'],
  example: 'Instead of one practice exam, you sit five, each covering a different chapter, and average the marks.',
  why: ['One split can be lucky or unlucky. 5 folds give a stable score to compare models fairly.',
        '5, not 10: each fold still trains on about 40,700 rows, and 10 folds would double the run time for little gain.'],
  got: ['Stratified 5-fold CV: about **40,718** train / **10,179** validate per fold.',
        'Every model used **the same 5 folds and ROC AUC**. Scores were stable (SD about **0.003**).'],
  show: { cells: [10, 26], code: 'tune', point: 'cv = StratifiedKFold(n_splits=5, ...) in cell 10, and cv=cv in tune() in cell 26.' },
  say: 'I used stratified 5-fold cross-validation on the development set. Every model used the same 5 folds and the same metric, ROC AUC, so the scores can be compared directly.',
  remember: '5 folds: train on 4, check on 1, rotate 5 times.',
  check: [
    { q: 'How does 5-fold CV work?', a: 'Split into 5, train on 4, check on 1, rotate 5 times, average.' },
    { q: 'Why not 10 folds?', a: 'It would double the run time for little gain. 5 folds are already stable (SD about 0.003).' },
    { q: 'Why stratified folds?', a: 'Each fold keeps the 50/50 mix, so fold scores are comparable.' }
  ] },

{ id: 'pipelines', group: 'data', title: 'Pipelines and data leakage',
  what: ['**Data leakage** is information from outside the training data getting into the model.',
         'A **pipeline** chains the preprocessing and the model, so every step learns from the training part only.'],
  example: 'Like setting the exam marking scheme before you see the exam answers.',
  why: ['If I scaled using all the data first, the validation folds would leak into their own preprocessing and scores would look too good.'],
  got: ['All scaling, encoding and new features sit **inside scikit-learn pipelines**. In each fold the scaler is fitted on the training part only.',
        'Two leaks handled: a **column leak** (pid, dropped) and a **fitting leak** (stopped by pipelines).'],
  show: { cells: [19], code: 'stepsfor', point: 'steps_for builds the steps that go inside each pipeline.' },
  say: 'All preprocessing is inside pipelines. In each fold the scaler is fitted on the training part only, so the validation part never leaks into its own preprocessing.',
  remember: 'Two leaks: a column leak (pid) and a fitting leak (pipelines fix it).',
  check: [
    { q: 'What are the two kinds of leakage here?', a: 'pid encoding the answer, and preprocessing fitted on all the data before splitting.' },
    { q: 'How do pipelines stop leakage?', a: 'Each step is fitted on the training part of each fold only.' },
    { q: 'Which cell builds the pipeline steps?', a: 'Cell 19, steps_for.' }
  ] },

/* ================= 2. PREPARING THE DATA ================= */
{ id: 'cleaning', group: 'prep', title: 'Cleaning: Sex, duplicates, BMI',
  what: ['**Binarisation** turns a two-value category into one 0/1 column.',
         'An **outlier** is a value far from the rest. First ask: **error or real?** Error → delete. Real → keep or cap.'],
  example: 'One basketball player in a class is real, so you keep him. But when designing desks, you cap his height so one person does not decide the size for everyone.',
  why: ['Sex was text, so I made it 0/1 (male = 1). Two values only need one column.',
        'BMI above 60 is rare but real, and those are high-risk people. Capping keeps them but stops extreme values dominating distances and weights.'],
  got: ['Sex: one 0/1 column. **231** rows had BMI above 60 (up to 98): **capped at 60**, not deleted.',
        '**1,365** duplicates kept.'],
  show: { cells: [12, 16], code: 'clean', point: 'The Sex line in cell 12, and BMI_clip in cell 16.' },
  say: 'I turned Sex into 0/1, because two values only need one column. I capped BMI at 60 instead of deleting outliers: those people are real high-risk cases, but capping stops extreme values dominating distances and weights.',
  remember: 'Outliers: error or real? Real → keep or cap.',
  check: [
    { q: 'How many rows had BMI above 60?', a: '231.' },
    { q: 'Why cap BMI instead of deleting?', a: 'They are real high-risk people. Capping stops extreme values dominating distances and weights.' },
    { q: 'How was Sex encoded?', a: 'One 0/1 column, male = 1.' }
  ] },

{ id: 'scaling', group: 'prep', title: 'Scaling: z-score vs min-max',
  what: ['**Scaling** puts columns on the same range, so no input shouts over the others.',
         '**Min-max** = (v − min) / (max − min) → 0 to 1. **Z-score** = (v − mean) / SD → mean 0, spread 1.',
         'Distance, margin and gradient models need it (k-NN, SVM, logistic regression, MLP). **Trees do not**: "is BMI above 30?" gives the same split at any scale.'],
  example: 'BMI is a loud voice and a 0/1 flag is a whisper. Scaling makes them talk at the same volume.',
  why: ['BMI has a **long right tail**. With min-max, the maximum sets the scale and squeezes most people into a narrow range. Z-score handles that better (shown in AT2).'],
  got: ['**Z-score scaling (StandardScaler)** for k-NN, logistic regression, MLP and SVM. Trees and ensembles got unscaled data.',
        'The 0/1 dummy columns were left unscaled: they are already 0 to 1.'],
  show: { cells: [19], code: 'stepsfor', point: 'StandardScaler in steps_for, and the passthrough for dummy columns.' },
  say: 'I used z-score scaling, not min-max, because BMI has a long right tail. Only k-NN, the SVM, logistic regression and the MLP were scaled. Trees only ask threshold questions, so scale does not change their splits.',
  remember: 'Min-max squeezes into a box. Z-score counts steps from average. Trees don\'t care.',
  check: [
    { q: 'Which models need scaling?', a: 'k-NN, SVM, logistic regression and MLP (distance, margin, gradient models).' },
    { q: 'Why don\'t trees need it?', a: 'A tree only asks "is BMI above 30?". Rescaling moves the threshold, not the split.' },
    { q: 'Why z-score and not min-max?', a: 'BMI\'s long tail: with min-max the maximum sets the scale and squeezes most values.' }
  ] },

{ id: 'onehot', group: 'prep', title: 'One-hot encoding',
  what: ['**One-hot encoding** turns one code into several 0/1 columns, one per level.',
         'If you keep codes as numbers, a linear model thinks code 4 is "4 times" code 1, a fake order.'],
  example: 'A light panel: one light on, all others off.',
  why: ['GenHlth, Age, Income and Education are **ordinal codes** (ordered, unequal gaps). A linear model would force a straight line through them.',
        'Trees can split anywhere, so they don\'t need it.'],
  got: ['One-hot encoded GenHlth, Age, Income, Education and BMI_cat, **for linear models only** (feature set F2).',
        'Logistic regression rose from **0.8244** to **0.8261**.'],
  show: { cells: [16], code: 'onehot', point: 'The levels dictionary inside one_hot.' },
  say: 'I one-hot encoded the ordinal codes for linear models only. A linear model treats Age code 13 as 13 times code 1, which forces a straight line. One-hot gives each band its own weight. Trees can split anywhere.',
  remember: 'One light on, all others off. Linear needs it, trees don\'t.',
  check: [
    { q: 'Which columns were one-hot encoded?', a: 'GenHlth, Age, Income, Education and BMI_cat.' },
    { q: 'Why only for linear models?', a: 'Linear models treat codes as amounts. Trees can split anywhere.' },
    { q: 'How much did it help logistic regression?', a: 'From 0.8244 to 0.8261.' }
  ] },

{ id: 'features', group: 'prep', title: 'The 9 new features',
  what: ['**Feature engineering** means building new inputs from existing ones.',
         'An **interaction** is two features that matter more together than apart.'],
  example: 'High blood pressure alone is a risk, high cholesterol alone is a risk, but both together are much worse.',
  why: ['The brief\'s hint: good features matter more than a better classifier. My AT2 analysis showed combinations matter (high BP + high cholesterol: 74.5% diabetes vs 22.6% with neither).'],
  got: ['**9 features**: BMI_clip, BMI_cat (WHO bands), CardioCount, BP_Chol, Age_BMI, Lifestyle, FreqPhysDistress, FreqMentDistress, PoorHealth.',
        'They helped models that can\'t build combinations themselves: **k-NN 0.812 → 0.816**, **logistic regression 0.823 → 0.826**. Boosting barely changed, because trees find these themselves.'],
  show: { cells: [16], code: 'addfeatures', point: 'The add_features function: BMI_clip and BP_Chol lines.' },
  say: 'I made 9 new features. They lifted k-NN from 0.812 to 0.816 and logistic regression from 0.823 to 0.826, but barely changed boosting, because trees already find interactions themselves.',
  remember: '2 BMI + 2 heart + 1 age + 1 habits + 3 flags = 9.',
  check: [
    { q: 'How many new features?', a: '9.' },
    { q: 'Which models did they help most?', a: 'k-NN (0.812 → 0.816) and logistic regression (0.823 → 0.826).' },
    { q: 'Why did boosting barely improve?', a: 'Trees already find interactions themselves.' }
  ] },

{ id: 'featuresets', group: 'prep', title: 'Feature sets and mutual information',
  what: ['A **feature set** is one list of inputs to train on.',
         '**Mutual information** scores how much one feature alone tells you about the target. It is a **filter method**: it judges each feature alone, before any model.'],
  example: 'Judging football players one by one can miss a player who only shines alongside a teammate.',
  why: ['I tested 4 feature sets before tuning, to see which inputs actually help each kind of model.'],
  got: ['**F0** raw · **F1** + new features · **F2** + one-hot · **F3** F1 minus 5 low-MI features (below 0.005).',
        'Linear models use **F2**. Trees and k-NN use **F1**.',
        'F3 **hurt** boosting (0.8280 → 0.8264): it dropped HvyAlcoholConsump, which is weak alone but matters once age and BMI are known (heavy drinkers 27.8% diabetes vs 51.0%).'],
  show: { cells: [18, 21], code: 'featuresets', point: 'The feature-set table in cell 21.' },
  say: 'I compared 4 feature sets with the same folds. Linear models were best with F2, trees and k-NN with F1. The filter set F3 hurt boosting, because mutual information judges features alone and missed HvyAlcoholConsump, which matters once age and BMI are known.',
  remember: 'F0 raw, F1 +features, F2 +one-hot, F3 filtered. Filters judge alone.',
  check: [
    { q: 'Name the 4 feature sets.', a: 'F0 raw, F1 + new features, F2 + one-hot, F3 filtered by mutual information.' },
    { q: 'Which set for linear models? For trees?', a: 'Linear F2. Trees and k-NN F1.' },
    { q: 'Why did F3 hurt?', a: 'The filter judged features alone and removed HvyAlcoholConsump, which matters together with age and BMI.' }
  ] },

/* ================= 3. THE MODELS ================= */
{ id: 'baseline', group: 'models', title: 'Baseline (the floor)',
  what: ['A **baseline** is the simplest possible model. The **majority-class** baseline always predicts the most common class.'],
  example: 'A weather forecaster who says "same as yesterday" every day. Any real forecaster should beat that.',
  why: ['To show the floor that every real model must beat.'],
  got: ['AUC **0.5** (pure guessing), because it ranks nobody.'],
  show: { cells: [28], point: 'Baseline: CV AUC 0.5000.' },
  say: 'I also used a majority-class baseline as the floor, which scores AUC 0.5.',
  remember: 'Baseline = the floor = AUC 0.5.',
  check: [
    { q: 'What does the baseline predict?', a: 'Always the most common class.' },
    { q: 'What AUC did it get?', a: '0.5.' },
    { q: 'Why include it?', a: 'To show the floor every model must beat.' }
  ] },

{ id: 'tree', group: 'models', title: 'Decision tree (Week 7)',
  what: ['A tree of yes/no questions. Each split picks the question that makes the groups **purest**.',
         '**Entropy** measures how mixed a group is (pure = 0, 50/50 = 1). **Information gain** = how much a split reduces it. Gini is another purity measure.',
         '**max_depth** = how many questions in a row. **min_samples_leaf** = the fewest people in a final group.'],
  example: 'The game 20 Questions.',
  why: ['It is the Week 7 method, easy to explain, and the building block of the ensembles.'],
  got: ['70 settings tried. Best: **entropy, depth 8, min leaf 200**. CV **0.816**, test **0.822**: the weakest tuned model.',
        'Weakness: deep trees memorise the data (high variance).'],
  show: { cells: [30, 31], code: 'tree', point: 'The grid search, then the depth curve.' },
  say: 'My decision tree used entropy, depth 8 and a minimum leaf of 200, with CV AUC 0.816. It was the weakest tuned model, because a single deep tree memorises noise, which is why the ensembles beat it.',
  remember: 'Entropy = messiness. A tree with no limits is a student who memorised the textbook.',
  check: [
    { q: 'How does a tree choose a split?', a: 'The question that makes the groups purest (highest information gain or Gini drop).' },
    { q: 'What were the best settings?', a: 'Entropy, depth 8, minimum leaf 200.' },
    { q: 'Its CV and test AUC?', a: 'CV 0.816, test 0.822.' }
  ] },

{ id: 'knn', group: 'models', title: 'k-NN (Week 8)',
  what: ['To classify a new person, find the **k most similar people** and take a vote.',
         'Similarity is a **distance**. **Euclidean** = straight line. **Manhattan** = add up the differences step by step.',
         'Small k = jumpy and noisy. Big k = smooth, but too big blurs everything.'],
  example: '"Tell me who your neighbours are, and I\'ll tell you who you are."',
  why: ['It is the Week 8 method, and it gives a completely different idea from trees: decide by similarity.',
        'It needs scaling, so BMI doesn\'t drown out the 0/1 flags.'],
  got: ['Best: **k = 201**, uniform weights, **Manhattan** distance. CV **0.820**, test **0.827**.',
        'Why so big a k: most features are 0/1, so many people tie at exactly the same distance. A big group gives a stable vote.',
        'Manhattan won because each 0/1 difference counts as one step, so no column dominates.',
        'It gained the most from the new features (0.812 → 0.816), because it can\'t build combinations itself.'],
  show: { cells: [33], code: 'knn', point: 'Best settings: manhattan, n_neighbors 201, uniform.' },
  say: 'k-NN needed k = 201 with Manhattan distance. Most features are 0/1, so many people are at exactly the same distance. A small k gives noisy votes, and a large k smooths them. It reached CV AUC 0.820.',
  remember: 'Ask your k neighbours. Euclid flies like a bird, Manhattan drives like a taxi.',
  check: [
    { q: 'How does k-NN decide?', a: 'It finds the k most similar people and takes a vote.' },
    { q: 'Why did it need k = 201?', a: 'Many 0/1 ties, so a small k gives noisy votes. A big k smooths them.' },
    { q: 'Why does k-NN need scaling?', a: 'It uses distances, so BMI would drown out the 0/1 flags.' }
  ] },

{ id: 'logreg', group: 'models', title: 'Logistic regression (Week 9)',
  what: ['A weighted sum of the inputs passed through an S-shaped **sigmoid** to give a probability. The boundary is a straight line.',
         '**C** controls regularisation: **small C = strict** = small weights = simpler model. L1 can zero weights, L2 shrinks them all.'],
  example: 'A points-based risk score: add points for each risk factor, then turn the total into a chance.',
  why: ['It is my linear classifier (Week 9): fast, stable and easy to explain.'],
  got: ['Best: **C = 0.01, L2**. CV **0.826**, test **0.832**, overfitting gap only **0.001**.',
        'Boosting beat it by a real difference (paired interval 0.0007 to 0.0040). It would be my backup if the client needed a simple points score.',
        'Weakness: it can\'t find interactions unless you give them.'],
  show: { cells: [36], code: 'logreg', point: 'Logistic regression: CV AUC 0.8264, best C 0.01, L2.' },
  say: 'Logistic regression is my linear classifier. The best was C = 0.01, strong L2 regularisation, with CV AUC 0.826 and almost no overfitting. But it can\'t find interactions unless I give them, and boosting beat it by a real difference.',
  remember: 'Small C = Strict Control.',
  check: [
    { q: 'What does a small C mean?', a: 'Strong regularisation: small weights, a simpler model.' },
    { q: 'Best settings and CV AUC?', a: 'C = 0.01, L2, CV 0.826.' },
    { q: 'Main weakness?', a: 'It can\'t find interactions unless you give them.' }
  ] },

{ id: 'mlp', group: 'models', title: 'MLP neural network (Week 9)',
  what: ['Layers of **neurons**. Each layer re-combines the last one, so it can learn **curved** boundaries.',
         'It learns by **backpropagation**: measure the error, send it backwards, adjust each weight a little (gradient descent).',
         '**Early stopping** holds back 10% and stops when that part stops improving.'],
  example: 'A team of junior analysts each spots one small pattern, and a senior analyst combines their reports.',
  why: ['To test whether the problem rewards a curved, more complex boundary.'],
  got: ['16 settings by random search. Best: **one layer of 64 tanh neurons**, alpha 0.062. CV **0.827**, test **0.8335**.',
        'Barely above logistic regression (0.826): little extra curve to find. Not significantly worse than boosting (a tie in the paired test).',
        'Weakness: a black box, and it depends on starting weights and scaling.'],
  show: { cells: [38], code: 'mlp', point: 'MLP: CV AUC 0.8270, best: tanh, (64,).' },
  say: 'The MLP had one layer of 64 tanh neurons, with CV AUC 0.827. It was the best non-tree model, but only just above logistic regression, and it is a black box, so there was no reason to give up explainability for it.',
  remember: 'Perceptron = one ruler. MLP = many rulers bent together.',
  check: [
    { q: 'What did the MLP find best?', a: 'One layer of 64 tanh neurons, CV 0.827.' },
    { q: 'Why wasn\'t it chosen?', a: 'Barely better than logistic regression and a black box; not better than boosting.' },
    { q: 'What does early stopping do?', a: 'Holds back 10% and stops when that part stops improving.' }
  ] },

{ id: 'svm', group: 'models', title: 'SVM (Week 10)',
  what: ['Finds the boundary with the **widest margin** (the widest street) between the classes.',
         'A **kernel** lets the boundary curve (RBF), as if the data were lifted into a higher dimension.',
         'Training time grows roughly with the **square** of the number of rows.'],
  example: 'Building a road between two villages as far as possible from the nearest houses on both sides.',
  why: ['It is the Week 10 method: a margin-based idea, different from trees, distance and logistic regression.'],
  got: ['Searched on a **10,000-row sample** for speed: 12 settings, linear and RBF.',
        'Best: **linear kernel, C = 0.01**. The sample score was **0.832** but noisy (SD 0.010). Re-scored on the full data: **0.826**.',
        'RBF did not beat linear: after one-hot encoding, a straight boundary already gets most of the signal.'],
  show: { cells: [40, 41], code: 'svm', point: 'SVM on the 10,000 sample: 0.8323 · on the full development set: 0.8256.' },
  say: 'For the SVM, the search ran on a 10,000-row sample for speed, but I re-scored the winner on the full data, because the sample score of 0.832 was noisy and would have wrongly ranked it first. On the full data it was 0.826.',
  remember: 'SVM = the widest street. Sample 0.832 → full 0.826.',
  check: [
    { q: 'Why search on a sample?', a: 'Kernel SVM time grows roughly with rows², so the full data was too slow.' },
    { q: 'Sample score vs full score?', a: '0.832 on the sample, 0.826 on the full data.' },
    { q: 'Why did RBF not beat linear?', a: 'After one-hot encoding, a straight boundary already captures most of the signal.' }
  ] },

{ id: 'bagging', group: 'models', title: 'Bagging and random forest (Week 11)',
  what: ['**Bagging**: train many deep trees, each on a **bootstrap sample** (rows drawn with replacement), then average them. It lowers **variance**.',
         '**Random forest** = bagging + each split may only look at a **random subset of features**, so the trees differ more.'],
  example: 'The wisdom of crowds: 100 people guessing a cow\'s weight, and the average guess is close.',
  why: ['To test whether averaging many trees beats one tree.'],
  got: ['Bagging (50 trees): 30% samples, leaf 20. CV **0.824**, gap **0.025**.',
        'Random forest (300 trees): depth 16, leaf 20, sqrt features. CV **0.825**, test **0.8315**, but the **biggest overfitting gap, 0.032**.',
        'Both beat the single tree, but averaging fixes variance, not bias, and here the errors were mostly bias.'],
  show: { cells: [43, 44], code: 'bagforest', point: 'Bagging 0.8239 and random forest 0.8254.' },
  say: 'Bagging and the random forest average many trees, which lowers variance. Both beat the single tree, but the forest had the biggest overfitting gap, 0.032, and averaging doesn\'t fix bias, which is where the errors were.',
  remember: 'Bagging = a bag of parallel trees, averaged. Forest = bagging + random features.',
  check: [
    { q: 'What does bagging lower?', a: 'Variance.' },
    { q: 'How is a forest different from bagging?', a: 'Each split looks at a random subset of features.' },
    { q: 'Which model had the biggest overfitting gap?', a: 'The random forest, 0.032.' }
  ] },

{ id: 'boosting', group: 'models', title: 'Gradient boosting (Week 11): my winner',
  what: ['Builds **small trees one after another**. Each new tree fixes the errors the team still makes. It lowers **bias**.',
         'The **learning rate** says how much of each new tree to add. **Early stopping** stops when the score stops improving.'],
  example: 'A student who, after every practice test, studies only the questions they got wrong.',
  why: ['Here the errors came mostly from bias, and boosting attacks bias directly.'],
  got: ['25 settings by random search. Best: learning rate **0.033**, **23** leaves, min leaf **290**, L2 **0.13**, **43%** of features, stopped at **287 trees**.',
        'CV **0.829** (0.8293), test **0.835** (0.8346, 95% CI 0.828 to 0.841). Accuracy **75.5%**, recall **79.8%**.',
        'Small overfitting gap, **0.012**, thanks to a low learning rate, big leaves and early stopping.'],
  show: { cells: [45], code: 'boosting', point: 'Gradient boosting: CV AUC 0.8293 (+/- 0.0030).' },
  say: 'Gradient boosting performed best: the highest CV AUC, 0.829, and test AUC 0.835 with 75.5% accuracy and 79.8% recall. It builds small trees in sequence, each fixing the last one\'s errors, which lowers bias, and here the errors were mostly bias.',
  remember: 'Boosting fixes Bias (B and B go together). Bagging fixes Variance.',
  check: [
    { q: 'How does boosting work?', a: 'Small trees in sequence, each fixing the errors left so far.' },
    { q: 'CV and test AUC?', a: 'CV 0.829, test 0.835.' },
    { q: 'How many trees, and why not more?', a: '287 trees. Early stopping stopped when the score stopped improving.' }
  ] },

{ id: 'voting', group: 'models', title: 'Soft voting (Week 11)',
  what: ['Combines several different models. **Soft voting** averages their predicted probabilities.',
         'It only helps if the models make **different** mistakes.'],
  example: 'Asking three doctors who all trained at the same school: you mostly get the same opinion three times.',
  why: ['To test whether combining my best three model types (boosting, logistic regression, MLP) adds anything.'],
  got: ['CV **0.8291**, test **0.8351**: just 0.0005 above boosting.',
        'The paired interval (−0.0014 to +0.0004) includes zero, so it is a **tie**. No real gain, because all three make similar mistakes.'],
  show: { cells: [47, 57], code: 'voting', point: 'Soft voting: CV AUC 0.8291, then the Soft voting row in the paired test.' },
  say: 'Soft voting scored 0.8351 against 0.8346, a difference of 0.0005, and the paired bootstrap interval includes zero. So it\'s a tie, and my rule, set before testing, picks the simpler model: one model instead of three.',
  remember: 'Three models, no real gain: they make the same mistakes.',
  check: [
    { q: 'Which models are in the vote?', a: 'Gradient boosting, logistic regression and the MLP.' },
    { q: 'It scored higher on test. Why not pick it?', a: 'The 0.0005 difference is not real (interval includes zero), and the rule picks the simpler model.' },
    { q: 'Why no gain?', a: 'The three models make similar mistakes.' }
  ] },

/* ================= 4. TUNING ================= */
{ id: 'search', group: 'tuning', title: 'Tuning: grid vs random search',
  what: ['**Hyper-parameters** are settings you choose before training (like tree depth). **Parameters** are learned from data (like weights).',
         '**Grid search** tries every combination. **Random search** tries a fixed number of random ones, and covers many settings faster.'],
  example: 'Baking a cake: oven temperature and time are your hyper-parameters; how the cake rises is learned.',
  why: ['Every model needed fair tuning: same folds, same metric, best setting kept.'],
  got: ['One **tune()** function for all models, scored by ROC AUC on the same 5 folds.',
        'Grid when settings were few: tree 70, k-NN 20, logistic 10, SVM 12, bagging 9. Random when many: MLP 16, forest 14, boosting 25.'],
  show: { cells: [26], code: 'tune', point: 'GridSearchCV / RandomizedSearchCV, scoring=\'roc_auc\', in tune().' },
  say: 'I used GridSearchCV when there were few settings, and RandomizedSearchCV when there were many, like the MLP, random forest and boosting. Every search used the same stratified 5-fold cross-validation and scored ROC AUC.',
  remember: 'Grid = try every box. Random = throw darts at the grid.',
  check: [
    { q: 'Hyper-parameter vs parameter?', a: 'Hyper-parameters are set by you before training. Parameters are learned from the data.' },
    { q: 'When did you use random search?', a: 'For the MLP, random forest and boosting, which have many settings.' },
    { q: 'What does tune() keep the same?', a: 'The same 5 folds and the same metric, ROC AUC.' }
  ] },

{ id: 'overfitting', group: 'tuning', title: 'Overfitting and bias-variance',
  what: ['**High bias** (underfitting): too simple, misses the pattern. **High variance** (overfitting): too complex, memorises noise.',
         'The **overfitting gap** = training score − validation score. A big gap means overfitting.'],
  example: 'Darts: all darts tight but off-target = bias. Darts scattered everywhere = variance.',
  why: ['To check each model was learning real patterns, not memorising.'],
  got: ['Gaps: random forest **0.032** (most), bagging 0.025, boosting **0.012**, logistic regression **0.001** (least).',
        'Depth curve for the tree: validation peaks around **depth 7 (0.815)**, then falls to **0.66 at depth 25** while training reaches **1.0**.'],
  show: { cells: [31, 49], code: 'tree', point: 'The depth curve (cell 31), and the gap column of the CV table (cell 49).' },
  say: 'I checked overfitting with the gap between training and validation AUC. The random forest had the biggest gap, 0.032; boosting stayed at 0.012. For the tree, validation AUC peaks around depth 7 and falls to 0.66 at depth 25 while training goes to 1.0: the bias-variance trade-off.',
  remember: 'Too simple = bias. Too complex = variance. Best = in between (depth about 7).',
  check: [
    { q: 'How is the gap calculated?', a: 'Training AUC minus validation AUC.' },
    { q: 'Which model overfit most?', a: 'Random forest, gap 0.032.' },
    { q: 'What does the depth curve show?', a: 'Validation peaks around depth 7, then falls to 0.66 at depth 25 while training goes to 1.0.' }
  ] },

/* ================= 5. RESULTS ================= */
{ id: 'auc', group: 'results', title: 'ROC AUC (my main measure)',
  what: ['A model gives each person a score. Slide the cut-off from 1 down to 0 and plot recall (TPR) against false alarms (FPR): that is the **ROC curve**.',
         '**AUC** = the area under it = the chance a random sick person gets a higher score than a random healthy one. 0.5 = coin flip, 1.0 = perfect.'],
  example: 'A smoke alarm you can tune: AUC says how good it is at telling fire from toast, whatever sensitivity you set.',
  why: ['For screening, **ranking** matters first, and AUC doesn\'t depend on one cut-off. The cut-off can be chosen later.',
        'Accuracy is also fair here, because the classes are balanced, so I report it too.'],
  got: ['Best test AUC **0.835**: an 83.5% chance a random person with diabetes scores higher than one without.',
        'All the ROC curves sit almost on top of each other.'],
  show: { cells: [55], point: 'The ROC curves on the test set, with each AUC in the legend.' },
  say: 'I chose ROC AUC because this is a screening problem. AUC measures ranking across every cut-off, and the cut-off can be chosen later. My best test AUC is 0.835.',
  remember: 'AUC = the chance a sick person outranks a healthy one. 0.5 = coin flip.',
  check: [
    { q: 'What does AUC mean in one sentence?', a: 'The chance a random person with diabetes scores higher than a random person without.' },
    { q: 'Why AUC for screening?', a: 'It measures ranking across every cut-off; the cut-off can be chosen later.' },
    { q: 'Is accuracy fair here?', a: 'Yes, because the classes are balanced 50/50. I report it too.' }
  ] },

{ id: 'confusion', group: 'results', title: 'Confusion matrix and metrics',
  what: ['A 2×2 table of truth vs prediction: **TP** (caught), **TN** (correctly cleared), **FP** (false alarm), **FN** (missed: the dangerous one).',
         '**Accuracy** = right / all. **Recall** = caught / all sick. **Precision** = truly sick / all flagged. **Specificity** = cleared / all healthy. **F1** = balance of precision and recall.'],
  example: 'A smoke alarm: TP = fire, beeps. FN = fire, silent (dangerous). FP = burnt toast, beeps. TN = no fire, silent.',
  why: ['To see the kinds of mistakes, not just one score.'],
  got: ['At cut-off 0.5: **TN 4,534 · FP 1,829 · FN 1,287 · TP 5,075**.',
        'Accuracy **75.5%**, recall **79.8%** (4 in 5 caught), precision **73.5%**, specificity **71.3%**, F1 **0.765**.'],
  show: { cells: [59], code: 'inside', point: 'The confusion matrix plot, Sensitivity 0.7977, Specificity 0.7126.' },
  say: 'At the 0.5 cut-off, recall is 79.8%, so it catches 4 in 5 people with diabetes, and specificity is 71.3%. Precision is 73.5% and accuracy 75.5%.',
  remember: 'Recall = did we catch them all? Precision = were our yeses right?',
  check: [
    { q: 'Recall formula and value?', a: 'TP / (TP + FN) = 5,075 / 6,362 = 79.8%.' },
    { q: 'Which mistake is most dangerous in screening?', a: 'The false negative: a missed person with diabetes.' },
    { q: 'Precision at 0.5?', a: '73.5%.' }
  ] },

{ id: 'bootstrap', group: 'results', title: 'Is a difference real? Bootstrap and paired test',
  what: ['**Bootstrap 95% CI**: resample the test rows with replacement 1,000 times, score each time, keep the middle 95%. It shows how much a score could move by chance.',
         '**Paired bootstrap**: score two models on the **same** resampled people and look at the difference. If its 95% interval includes 0, they are not really different.'],
  example: 'Two runners finish 0.01 s apart but the stopwatch error is 0.05 s: you can\'t honestly say who won.',
  why: ['The models were very close, so I needed to know which differences were real and which were just noise.'],
  got: ['Boosting test AUC **0.835**, 95% CI **0.828 to 0.841**.',
        'Boosting vs soft voting: −0.0014 to +0.0004 → **tie**. Boosting vs MLP: also a **tie**.',
        'Boosting is **really better** than the other 6: logistic regression, SVM, random forest, bagging, k-NN and the tree.'],
  show: { cells: [54, 57], code: 'paired', point: 'The auc_95_ci column (cell 54) and the really_different column (cell 57).' },
  say: 'To know if differences were real, I used 1,000 bootstrap samples of the test set for 95% confidence intervals, and a paired bootstrap that compares two models on the same resampled people. Boosting tied with soft voting and the MLP, and beat the other six.',
  remember: 'Interval includes 0 → tie.',
  check: [
    { q: 'What is a paired bootstrap?', a: 'Score both models on the same resampled people and check the difference.' },
    { q: 'Which models tie with boosting?', a: 'Soft voting and the MLP.' },
    { q: 'Boosting\'s 95% CI?', a: '0.828 to 0.841.' }
  ] },

{ id: 'winner', group: 'results', title: 'Choosing the winner: the one-standard-error rule',
  what: ['**Standard error** = SD / √(number of folds). Any model within one standard error of the top score is a **tie**, because the difference is smaller than the normal noise. Then pick the **simplest**.',
         'Set the rule **before** looking at the test set, so you can\'t cherry-pick.'],
  example: 'Occam\'s razor: when two explanations work equally well, choose the simpler one.',
  why: ['Boosting and soft voting were almost equal, and I needed a fair, pre-set way to choose.'],
  got: ['SE = 0.0030 / √5 = **0.0013**, so the tie band is CV AUC **≥ 0.828**.',
        'Tied: **boosting (0.8293)** and **soft voting (0.8291)**. Chosen: **boosting**, one model instead of three.'],
  show: { cells: [52], code: 'selection', point: 'Tied models: Gradient boosting, Soft voting · Chosen model: Gradient boosting.' },
  say: 'My rule, set before testing, was: anything within one standard error of the top CV score is a tie, then choose the simplest. The standard error was 0.0013, so boosting and soft voting were tied, and boosting is one model instead of three.',
  remember: 'Within one SE = too close to call → pick the simpler.',
  check: [
    { q: 'How is the standard error calculated?', a: '0.0030 / √5 = 0.0013.' },
    { q: 'Which models tied?', a: 'Gradient boosting and soft voting.' },
    { q: 'Why set the rule before testing?', a: 'So I couldn\'t cherry-pick from the test results.' }
  ] },

{ id: 'importance', group: 'results', title: 'Which features matter (permutation importance)',
  what: ['**Permutation importance**: shuffle one column and measure how much the score drops. A big drop = the model relies on it. It works for any model.'],
  example: 'Remove one ingredient from a recipe at a time and see how much worse it tastes.',
  why: ['To check the model learned sensible patterns, not noise.'],
  got: ['Top 5 drops in test AUC: **GenHlth 0.057, BMI 0.038, Age 0.026, HighBP 0.018, HighChol 0.011**.',
        'They match the known risk factors for type 2 diabetes, so the model learned real patterns.'],
  show: { cells: [61], code: 'inside', point: 'The permutation importance chart.' },
  say: 'GenHlth, BMI, Age, HighBP and HighChol drive the model, with GenHlth dropping AUC by 0.057 when shuffled. They match the known risk factors for type 2 diabetes, which suggests the model learned real patterns.',
  remember: 'G-B-A-B-C: GenHlth, BMI, Age, BP, Chol.',
  check: [
    { q: 'How does permutation importance work?', a: 'Shuffle one column and measure the drop in AUC.' },
    { q: 'Name the top 5 features.', a: 'GenHlth, BMI, Age, HighBP, HighChol.' },
    { q: 'Can it prove HighBP causes diabetes?', a: 'No. The data is cross-sectional and self-reported; HighBP may be a result.' }
  ] },

{ id: 'cutoff', group: 'results', title: 'The 0.27 screening cut-off',
  what: ['The model gives a probability. The **cut-off** turns it into yes/no.',
         'Lower cut-off → more people flagged → recall up, precision down.'],
  example: 'Cancer screening wants recall (don\'t miss anyone). A spam filter wants precision (don\'t throw away real email).',
  why: ['In screening, a missed case costs more than one extra blood test, so I wanted higher recall.',
        'I chose it on **development-set predictions only**, so the test score stays honest.'],
  got: ['Rule: the lowest cut-off keeping precision at **0.65 or above** → **0.27**.',
        'On test: recall **93.9%**, precision **65.4%**, accuracy **72.1%** (vs 0.5: recall 79.8%).'],
  show: { cells: [63, 64], code: 'cutoff', point: 'Chosen cut-off: 0.273, and the two printed lines.' },
  say: 'I chose a screening cut-off of 0.27 using only development-set predictions. It lifts recall from 79.8% to 93.9%, at the cost of precision falling to 65.4%. I didn\'t use the test set, because then its score would no longer be honest.',
  remember: '0.27 → 93.9% caught.',
  check: [
    { q: 'What does 0.27 give?', a: 'Recall 93.9%, precision 65.4%, accuracy 72.1%.' },
    { q: 'Why lower the cut-off for screening?', a: 'A missed case costs more than an extra test.' },
    { q: 'Why not choose it on the test set?', a: 'Then the test score would no longer be honest.' }
  ] },

{ id: 'limits', group: 'results', title: 'Final model, limits and what I\'d do next',
  what: ['After choosing, retrain the model on **all** labelled data. The test score stays the honest estimate.',
         '**Correlation is not causation**: a model can predict without knowing causes.'],
  example: 'Ice-cream sales and drownings both rise in summer, but ice cream doesn\'t cause drowning.',
  why: ['To be honest about what the model can and can\'t do.'],
  got: ['Final boosting model refit on all **63,622** rows. Expected AUC on new people: **0.835**.',
        'Test AUC is a little higher than CV because final models trained on 50,897 rows, not about 40,700 per fold. Not overfitting.',
        'Limits: can\'t say what causes diabetes; probabilities assume 50% prevalence and need recalibrating to about **14%**; AUC about 0.83 is near the limit of 21 survey answers.',
        'With more time: nested cross-validation, probability calibration, a time budget per model, saving progress from day one.'],
  show: { cells: [66], code: 'final', point: 'Expected AUC on new people (from the test set): 0.8346.' },
  say: 'The model can find who has diabetes, but it can\'t say what causes it, because the data is cross-sectional and self-reported. It would rank real people well, but the probabilities assume 50% prevalence and would need recalibrating to about 14%.',
  remember: 'Ranks yes, causes no, recalibrate 50 → 14.',
  check: [
    { q: 'Why is test AUC above CV AUC?', a: 'The final models trained on 50,897 rows instead of about 40,700 per fold.' },
    { q: 'Would it work on the real population?', a: 'It would rank well, but probabilities need recalibrating from 50% to about 14%.' },
    { q: 'What would you do with more time?', a: 'Nested CV, calibration, a time budget per model, saving progress from day one.' }
  ] },

/* ================= 6. AT2 ================= */
{ id: 'at2-explore', group: 'at2', title: 'AT2: understanding the data',
  what: ['**Attribute types (NOIR)**: Nominal (labels), Ordinal (ordered, unequal gaps), Interval (equal gaps, no true zero), Ratio (true zero: "twice as much" makes sense).',
         '**Spearman** correlation uses ranks (fits ordinal/binary data). **Cramér\'s V** = strength of a link between categories (0 to 1).',
         '**k-means** groups records without labels; the **elbow** picks k. **Outliers**: 1.5 × IQR rule or 3-SD rule.'],
  example: '20 kg is twice 10 kg (ratio), but 20 °C is not twice as hot as 10 °C (interval).',
  why: ['AT2 used my **3,000-row extract** to understand the data before modelling. Its numbers differ from AT3.'],
  got: ['Types: BMI, MentHlth, PhysHlth = ratio; GenHlth, Age, Education, Income = ordinal; 14 flags + Sex = nominal.',
        'Strongest links (Cramér\'s V): **GenHlth 0.43, HighBP 0.38, BMI 0.36**. High BP + high cholesterol: **74.5%** diabetes vs **22.6%** with neither → became **BP_Chol**.',
        'k-means, **k = 4**: a "healthy-looking but high-risk" cluster, **1,107** people, **63%** diabetes. The classes overlap, which explains the AUC ceiling of about 0.83.',
        'Outliers: **96** BMI records above the IQR fence of 45 (39 by 3-SD). Kept, because they are real.'],
  show: { cells: [], point: 'No AT3 cell. Point to how these became AT3 choices: BP_Chol (cell 16), one-hot for ordinal codes, keeping outliers.' },
  say: 'In AT2 I typed every attribute and used Spearman, because most attributes are ordinal or binary. The strongest links were GenHlth, HighBP and BMI, and high blood pressure with high cholesterol gave 74.5% diabetes, which became my BP_Chol feature.',
  remember: 'NOIR: name → order → add → multiply. Can you say "twice as much"? Yes = ratio.',
  check: [
    { q: 'Why Spearman, not Pearson?', a: 'Most attributes are ordinal or binary, so a rank-based correlation fits better.' },
    { q: 'What was the hidden-risk cluster?', a: '1,107 people who looked healthy but had 63% diabetes.' },
    { q: 'What type is GenHlth?', a: 'Ordinal: ordered, but the gaps are not equal.' }
  ] },

{ id: 'at2-prep', group: 'at2', title: 'AT2: binning, normalisation, discretisation',
  what: ['**Equi-width binning**: equal-size intervals. **Equi-depth**: about equal counts; identical values must stay together. **Smoothing**: replace values with the bin mean or nearest boundary.',
         '**Normalisation**: min-max (0 to 1), z-score (mean 0, SD 1), decimal scaling (divide by a power of 10, does not centre).',
         '**Binning** keeps numbers; **discretisation** turns them into labels. **Binarisation** turns a category into 0/1.'],
  example: 'Width = same-size boxes. Depth = the same number of people in each box.',
  why: ['To learn which transformations suit this data, before AT3.'],
  got: ['Equi-width put **84%** of MentHlth in bin 1. Equi-depth: bin 1 = all **2,018** zeros (67%), because identical values stay together.',
        'Bin-mean smoothing **lowered** variance; bin-boundary **raised** it. Recommended: equi-depth + bin mean.',
        'BMI min-max (max 92 sets the scale): about half below 0.20. Z-score: mean **30.04**, SD **7.34**, **39** beyond |z| = 3. **Z-score chosen** → used in AT3.',
        'Age codes → **5 life stages**. Sex → one 0/1 column (male = 1).'],
  show: { cells: [12, 19], point: 'In AT3: Sex as one 0/1 column (cell 12) and StandardScaler (cell 19).' },
  say: 'In AT2 I rejected min-max for BMI because the maximum of 92 sets the scale, and one new extreme value would change everyone\'s scale. Z-score keeps the spread meaningful, so I used it in AT3.',
  remember: 'Mean smooths down, boundary spreads out. Binning keeps numbers, discretisation makes labels.',
  check: [
    { q: 'Why couldn\'t the equi-depth bins be equal?', a: '67% of MentHlth values are 0, and identical values must stay in one bin.' },
    { q: 'Why not min-max for BMI?', a: 'The maximum of 92 sets the scale, and one new extreme changes everyone\'s scale.' },
    { q: 'How did AT2 shape AT3?', a: 'Drop pid, binarise Sex, z-score scaling, and the BP × Chol and risk-count interactions became features.' }
  ] }
];

/* The numbers to know, in story order. */
CONTENT.numbers = [
  ['Rows / columns', '63,622 rows · 23 columns (pid + target + 21)'],
  ['Class balance', '31,811 each = 50/50 · real prevalence about 14%'],
  ['pid leak', 'One split on pid = AUC 1.000'],
  ['Split', 'Development 50,897 (80%) · test 12,725 (20%) · seed 42'],
  ['New features / sets', '9 new features · 4 feature sets (F0 to F3)'],
  ['Best model', 'Gradient boosting: CV 0.829 (0.8293 ± 0.0030) · test 0.835 (CI 0.828 to 0.841)'],
  ['Test metrics (0.5)', 'Accuracy 75.5% · precision 73.5% · recall 79.8% · specificity 71.3% · F1 0.765'],
  ['Runner-up', 'Soft voting: CV 0.8291 · test 0.8351 (tie)'],
  ['Spread', 'All 9 tuned models within 0.013 AUC on test'],
  ['One-SE rule', 'SE = 0.0030 / √5 = 0.0013 → tie band ≥ 0.828'],
  ['Overfitting gaps', 'Random forest 0.032 · boosting 0.012 · logistic 0.001'],
  ['SVM trap', 'Sample 0.832 → full data 0.826'],
  ['Top features', 'GenHlth 0.057 · BMI 0.038 · Age 0.026 · HighBP 0.018 · HighChol 0.011'],
  ['Cut-off', '0.27 → recall 93.9% · precision 65.4% · accuracy 72.1%']
];

/* =====================================================================
   THEORY for each topic (from the course knowledge base):
     terms = key definitions [term, definition]
     steps = how it works, step by step
     pros / cons = strengths and weaknesses
   The app shows these right after "What is it?", and lists every term
   on the Definitions page (A to Z).
   ===================================================================== */
CONTENT.topics.unshift({ id: 'basics', group: 'start', title: 'Data analytics basics',
  what: ['**Data** is recorded facts. **Data analytics** turns those facts into useful decisions.',
         '**Machine learning (ML)** lets the computer learn the rules from examples instead of you writing them. **AI** is the big umbrella: any system that does something we would call smart.'],
  example: 'A shop owner writes down daily sales (data), notices umbrellas sell more on rainy days (analytics), and a program learns to predict tomorrow\'s umbrella sales (machine learning).',
  why: ['My project follows the standard recipe for a data project, **CRISP-DM**, with one rule the whole way: no decision is made by looking at the test data (AT3 report section 2).'],
  got: ['Business understanding: a screening tool, measured by ROC AUC. Data understanding: found the pid leak. Preparation: drop pid, cap BMI, 9 new features, scaling.',
        'Modelling: 9 classifiers tuned with 5-fold CV. Evaluation: test set, bootstrap CIs, confusion matrix, cut-off. Deployment: final model trained on all 63,622 rows.'],
  show: { cells: [0], point: 'The table in the first cell: each notebook section and the report part it supports.' },
  say: 'I followed the CRISP-DM steps, with one rule the whole way through: no decision was made by looking at the data that would later be used to test it.',
  remember: 'CRISP-DM = Big Dogs Prefer Meat, Every Day. Analytics ladder = What, Why, Will, Should.',
  check: [
    { q: 'Name the 6 CRISP-DM steps.', a: 'Business understanding, data understanding, data preparation, modelling, evaluation, deployment.' },
    { q: 'Machine learning vs AI?', a: 'ML is one part of AI: learning patterns from data. AI is any smart behaviour.' },
    { q: 'Which kind of analytics is your AT3 model?', a: 'Predictive: it predicts who has diabetes.' }
  ] });

(function () {
  var T = {
  basics: {
    terms: [
      ['Data', 'Recorded facts, such as survey answers.'],
      ['Data analytics', 'Turning data into useful decisions, with or without machine learning.'],
      ['Machine learning (ML)', 'Letting the computer learn the rules from examples instead of writing them by hand.'],
      ['Artificial intelligence (AI)', 'The big umbrella: any system that does something we would call smart. ML sits inside AI.'],
      ['Descriptive analytics', 'What happened? Example: 51.4% of the AT2 sample had diabetes.'],
      ['Diagnostic analytics', 'Why did it happen? Example: the diabetes rate rises with age and BMI.'],
      ['Predictive analytics', 'What will happen? Example: the AT3 model predicts who has diabetes.'],
      ['Prescriptive analytics', 'What should we do? Example: use a 0.27 cut-off to screen more people.'],
      ['CRISP-DM', 'Cross-Industry Standard Process for Data Mining: the 6-step cycle of a data project.'],
      ['Big data (the 5 Vs)', 'Volume (how much), Velocity (how fast), Variety (how many types), Veracity (how trustworthy), Value (is it useful).'],
      ['Ethics', 'Privacy, fairness, transparency and accountability. A survey-based model must not be sold as a medical diagnosis.']
    ],
    steps: ['**Business understanding:** what problem, and how is success measured?', '**Data understanding:** explore, describe, check quality.', '**Data preparation:** clean, transform, build features.', '**Modelling:** train and tune models.', '**Evaluation:** check results against the goal.', '**Deployment:** put it to use. Going back to an earlier step is normal: it is a cycle.']
  },
  project: {
    terms: [
      ['Supervised learning', 'Learning with an answer key: every example has a label, and the model learns to map inputs to it.'],
      ['Unsupervised learning', 'Learning without labels: the model finds structure by itself, such as groups (AT2 clustering).'],
      ['Classification', 'Supervised learning where the label is a category (yes/no).'],
      ['Regression', 'Supervised learning where the label is a number (like a house price).'],
      ['Binary classification', 'Classification with exactly two classes, here 1 or 0.'],
      ['Target (class label)', 'The column you want to predict.'],
      ['Screening', 'Ranking many people by risk and testing the highest-risk first.']
    ]
  },
  marking: {
    terms: [
      ['Oral defence', 'A short spoken exam where you explain and defend your own work.'],
      ['Trade-off', 'Gaining one thing by giving up another.'],
      ['Evidence', 'A number from your results plus where it is in the notebook.']
    ]
  },
  data: {
    terms: [
      ['Instance (record, row)', 'One example in the table: here, one person.'],
      ['Attribute (feature, column)', 'One measured property, such as BMI or HighBP.'],
      ['Target', 'The column you want to predict: Diabetes_binary.'],
      ['Missing value', 'An empty cell. Options: delete the row, fill with a constant, fill with the mean/median/mode, or a smart guess.'],
      ['Duplicate', 'Two identical rows. Remove if it is a data-entry error; keep if they are real different people.'],
      ['Class balance', 'How often each class appears. Balanced = equal counts.'],
      ['Prevalence', 'How common a condition is in the real population.'],
      ['Resampling', 'Picking rows to change the class mix, for example to make it 50/50.']
    ]
  },
  pid: {
    terms: [
      ['Data leakage', 'Information that would not be available in real life sneaking into training, so scores look amazing but are fake.'],
      ['Target leakage', 'A feature that secretly contains the answer.'],
      ['Identifier (ID)', 'A column that only names a record. It should carry no information about the target.']
    ],
    steps: ['Check every column against the target, even ones that look like IDs.', 'Plot the target rate across bands of the column.', 'Test a one-split tree on that column alone.', 'A near-perfect score from one column means a leak: drop it.']
  },
  split: {
    terms: [
      ['Training set', 'The data the model learns from.'],
      ['Validation set', 'The data used to choose settings (in CV, the fold left out).'],
      ['Test set', 'Data kept aside and used once at the end, for an honest score.'],
      ['Development set', 'Everything except the test set: used for training and validation.'],
      ['Hold-out method', 'Splitting the data once into parts for training and testing.'],
      ['Stratified split', 'A split that keeps the same class mix in every part.'],
      ['Random seed', 'A fixed starting number for randomness, so results repeat exactly.']
    ]
  },
  cv: {
    terms: [
      ['Cross-validation (CV)', 'Splitting data into k folds, training on k−1 and validating on the one left out, rotating and averaging.'],
      ['Fold', 'One of the k equal parts.'],
      ['Stratified k-fold', 'k-fold where every fold keeps the same class mix.'],
      ['CV mean and SD', 'The average score across folds, and how much it varies.'],
      ['Nested cross-validation', 'An inner CV loop chooses settings, an outer loop scores the whole process: an even more honest estimate.']
    ],
    steps: ['Cut the development data into 5 equal parts (folds).', 'Train on 4 folds, validate on the 5th.', 'Repeat 5 times so each fold is validated once.', 'Report the average of the 5 scores and their SD.'],
    pros: ['Every row is used for validation once.', 'A mean and a spread instead of one lucky split.'],
    cons: ['k times slower than one split.']
  },
  pipelines: {
    terms: [
      ['Pipeline', 'A chain of preprocessing steps and a model, fitted together on training data only.'],
      ['Fit', 'Learn the numbers of a step (like a mean) or a model\'s weights from data.'],
      ['Transform', 'Apply the learned step to data, such as subtracting the mean.'],
      ['Preprocessing leakage', 'Fitting a step like a scaler on all the data before splitting, so the test data shapes the training.']
    ]
  },
  cleaning: {
    terms: [
      ['Data cleaning', 'Fixing the four common problems: missing values, duplicates, noise and outliers.'],
      ['Garbage in, garbage out', 'A great model on bad data gives bad answers.'],
      ['Noise', 'Random error in values.'],
      ['Outlier', 'A value far from the rest. It can be an error (age = 999) or a real but rare case (BMI 92).'],
      ['1.5 × IQR rule', 'An outlier is below Q1 − 1.5×IQR or above Q3 + 1.5×IQR.'],
      ['3-SD rule', 'An outlier is more than 3 standard deviations from the mean.'],
      ['Capping (clipping)', 'Keeping the row but lowering values above a limit to that limit.'],
      ['Binarisation', 'Turning a two-value category into one 0/1 column.']
    ],
    steps: ['Check missing values.', 'Check duplicates: error or real people?', 'Check outliers: error → delete; real → keep or cap.', 'Encode text columns as numbers.']
  },
  scaling: {
    terms: [
      ['Normalisation (scaling)', 'Putting columns on the same scale so no column dominates.'],
      ['Min-max', '(v − min) / (max − min), giving 0 to 1. Weakness: one extreme value squashes everyone else.'],
      ['Z-score', '(v − mean) / SD, giving mean 0 and SD 1. Works well with outliers; no fixed range.'],
      ['Decimal scaling', 'v / 10^j, giving values between −1 and 1. Quick, but does not centre the data.'],
      ['Mean', 'The sum divided by the count. Pulled by extreme values.'],
      ['Standard deviation (SD)', 'The typical distance from the mean, in the original units.'],
      ['Skewness', 'Lopsidedness. Right-skewed = a long tail to the right, and the mean sits above the median.']
    ],
    steps: ['Worked example, BMI 40 with AT2 numbers (min 14, max 92, mean 30.04, SD 7.34):', 'Min-max: (40 − 14) / 78 = 0.33.', 'Z-score: (40 − 30.04) / 7.34 = 1.36 (1.36 SDs above average).', 'Decimal scaling: 40 / 100 = 0.40.'],
    pros: ['Z-score: good for most cases, especially with outliers.', 'Min-max: good when a method needs inputs between 0 and 1.'],
    cons: ['Min-max: one extreme value squashes everyone.', 'Z-score: no fixed range.']
  },
  onehot: {
    terms: [
      ['Nominal', 'Names or labels with no order (Sex, HighBP).'],
      ['Ordinal', 'Ordered categories with unequal gaps (GenHlth 1 to 5, Age codes).'],
      ['One-hot encoding', 'A category with k values becomes k separate 0/1 columns, with exactly one "1" per row.'],
      ['Dummy variable', 'One of the 0/1 columns created by one-hot encoding.'],
      ['Fake order', 'The wrong idea a model gets from codes: that code 3 is "three times" code 1.']
    ],
    steps: ['List every level of the category.', 'Make one 0/1 column per level.', 'Put a 1 in the matching column, 0 in the rest.', 'Drop the original code column.']
  },
  features: {
    terms: [
      ['Feature engineering', 'Using what you know to build more useful inputs.'],
      ['Interaction', 'Two features combined, because together they matter more (BP_Chol = HighBP × HighChol).'],
      ['Aggregation (count)', 'Adding several flags into one score (CardioCount, Lifestyle).'],
      ['Threshold flag', 'A 0/1 column that is 1 when a value passes a limit (FreqPhysDistress = 14+ bad days).'],
      ['Banding', 'Grouping a number into ranges (BMI_cat = WHO bands).']
    ]
  },
  featuresets: {
    terms: [
      ['Feature subset selection', 'Choosing which features to keep.'],
      ['Filter method', 'Score each feature alone, before modelling (mutual information, correlation, chi-square).'],
      ['Wrapper method', 'Try feature subsets with a real model and keep the best (forward or backward selection).'],
      ['Embedded method', 'Selection happens inside training (L1 sets weights to 0; tree importance).'],
      ['Mutual information', 'How much one feature alone tells you about the target. 0 = nothing.'],
      ['Curse of dimensionality', 'With many columns, everything is far from everything, so distances stop meaning much.'],
      ['PCA', 'Principal Component Analysis: squeezes many columns into a few summary columns that keep the most variation.'],
      ['Conditional relevance', 'A feature that is weak alone but useful together with others.']
    ],
    pros: ['Filter: fast and simple.'],
    cons: ['Filter: misses teamwork between features (it dropped HvyAlcoholConsump).']
  },
  baseline: {
    terms: [
      ['Baseline', 'The simplest possible model. Any real model should beat it.'],
      ['Majority-class baseline', 'Always predicts the most common class (DummyClassifier).'],
      ['AUC 0.5', 'No better than guessing: a coin flip.']
    ]
  },
  tree: {
    terms: [
      ['Decision tree', 'A tree of yes/no questions that ends in a class.'],
      ['Node / branch / leaf', 'A node tests an attribute, a branch is an answer, a leaf is a final class.'],
      ['Root', 'The first question at the top of the tree.'],
      ['Entropy', 'How mixed a group is: −Σ p log₂ p. Pure = 0; a 50/50 mix of 2 classes = 1.'],
      ['Information gain', 'Entropy before a split minus the weighted entropy after it.'],
      ['ID3', 'The classic algorithm: pick the attribute with the highest information gain, split, repeat.'],
      ['Gini impurity', 'Another purity measure: 1 − Σ p². 0 when pure. The scikit-learn default.'],
      ['Pruning', 'Growing the tree, then cutting back branches that don\'t help on validation data.'],
      ['max_depth', 'How many questions in a row.'],
      ['min_samples_leaf', 'The fewest records each leaf must hold.']
    ],
    steps: ['Start with all the data at the root.', 'Compute the information gain (or Gini drop) of every possible split.', 'Split on the best one.', 'Repeat on each branch until the groups are pure or a limit (depth, leaf size) is reached.', 'Worked example (PlayTennis, 9 Yes / 5 No): entropy = 0.940, Gini = 0.459. Outlook had the highest gain (0.246), so it goes at the root.'],
    pros: ['Easy to explain.', 'No scaling needed.', 'Handles mixed data types.'],
    cons: ['Overfits easily (memorises).', 'Unstable: small data changes give a different tree.', 'One tree is usually weaker than an ensemble.']
  },
  knn: {
    terms: [
      ['k-NN (k-nearest neighbours)', 'Classify a new record by a vote of its k most similar training records.'],
      ['k', 'How many neighbours vote. Small k = noisy (high variance). Large k = smooth, but too large blurs (high bias).'],
      ['Distance', 'How different two records are. Similarity is the opposite.'],
      ['Euclidean distance', 'Straight line, "as the bird flies": √(Σ (a − b)²).'],
      ['Manhattan distance', 'City blocks, "as the taxi drives": Σ |a − b|.'],
      ['Distance-weighted vote', 'Closer neighbours get a bigger vote.'],
      ['Lazy learner', 'Does no work while training (it just stores the data); all the work happens at prediction time.'],
      ['Simple matching coefficient (SMC)', '(matches on 1s and 0s) / all: similarity for symmetric 0/1 data like Sex.'],
      ['Jaccard coefficient', 'a / (a + b + c): ignores "both 0", for rare (asymmetric) flags like Stroke.'],
      ['Curse of dimensionality', 'With many features, distances stop meaning much.']
    ],
    steps: ['Scale the data, so BMI doesn\'t drown out the 0/1 flags.', 'For a new person, compute the distance to every training person.', 'Take the k closest.', 'Vote: the majority class wins.', 'Worked example: A = (BMI 30, Age 5), B = (BMI 26, Age 8). Euclidean = √(16 + 9) = 5. Manhattan = 4 + 3 = 7.'],
    pros: ['Simple, no training.', 'Works with any shape of boundary.'],
    cons: ['Needs scaling.', 'Slow to predict on big data.', 'Hurt by many irrelevant features.', 'Needs a good distance measure.']
  },
  logreg: {
    terms: [
      ['Linear classifier', 'Separates classes with a straight line (or flat plane).'],
      ['Linearly separable', 'One straight line can separate the two classes.'],
      ['Weights and bias', 'The line: predict "yes" if w₁x₁ + w₂x₂ + … + b > 0.'],
      ['Sigmoid', 'An S-shaped curve that turns any number into a probability between 0 and 1.'],
      ['Logistic regression', 'A weighted sum of inputs passed through a sigmoid to give a probability.'],
      ['Cross-entropy (log loss)', 'The error logistic regression minimises during training.'],
      ['Least squares (SSE)', 'Choosing weights that make the sum of squared errors smallest.'],
      ['Gradient descent', 'Start with random weights, then take small steps downhill on the error. The learning rate is the step size.'],
      ['Regularisation', 'A penalty that keeps weights small so the model doesn\'t overfit.'],
      ['C', 'Inverse regularisation strength: small C = strong penalty = simpler model.'],
      ['L1 (lasso) / L2', 'L1 can push useless weights to exactly 0 (built-in feature selection). L2 shrinks all weights a little.'],
      ['Odds ratio', 'How each weight can be read: how much a feature changes the odds of the outcome.']
    ],
    steps: ['Multiply each input by its weight and add the bias.', 'Pass the total through the sigmoid → a probability.', 'Compare with a cut-off (0.5 by default) → yes or no.', 'Training: adjust the weights by gradient descent to reduce cross-entropy.'],
    pros: ['Fast, stable, easy to explain.'],
    cons: ['Only straight boundaries.', 'Needs interactions made by hand.']
  },
  mlp: {
    terms: [
      ['Neuron', 'Multiplies inputs by weights, adds them up, and applies an activation.'],
      ['Perceptron', 'The simplest neural network: one neuron, a straight boundary. It cannot learn XOR.'],
      ['XOR', '"One or the other but not both": a pattern no single straight line can separate.'],
      ['Multi-layer perceptron (MLP)', 'Neurons in layers: input → hidden layer(s) → output. It can learn curved boundaries.'],
      ['Hidden layer', 'A layer between input and output that combines inputs in new ways.'],
      ['Activation function', 'The bend a neuron adds: ReLU, tanh or sigmoid.'],
      ['Backpropagation', 'Send the error backwards to find how much each weight was to blame, then adjust it.'],
      ['alpha', 'The MLP\'s L2 penalty (bigger = stronger).'],
      ['Early stopping', 'Hold back 10% of the training data and stop when that part stops improving.']
    ],
    steps: ['Forward pass: inputs go through the layers to a prediction.', 'Measure the error.', 'Backpropagation: send the error backwards to each weight.', 'Adjust the weights by gradient descent.', 'Repeat until early stopping says stop.'],
    pros: ['Learns curved boundaries and its own feature combinations.'],
    cons: ['A black box.', 'Sensitive to scaling and starting weights.']
  },
  svm: {
    terms: [
      ['Support vector machine (SVM)', 'Finds the boundary with the widest margin between the classes.'],
      ['Margin', 'The width of the "street" between the classes. Wider = safer for new points.'],
      ['Support vectors', 'The points on the edge of the street. Only they decide where the line goes.'],
      ['Soft margin', 'Allowing some points on the wrong side, because real data overlaps.'],
      ['C (in SVM)', 'The penalty for mistakes. Large C = strict, narrow street, risk of overfitting. Small C = relaxed, wider street, simpler.'],
      ['Kernel trick', 'Computing as if the data were lifted to a higher dimension where a flat cut works, without actually lifting it.'],
      ['Kernels', 'Linear (no lift), polynomial, RBF (radial basis function, the most popular).'],
      ['gamma (RBF)', 'How far one point\'s influence reaches. Large gamma = very local, wiggly boundary (overfitting).']
    ],
    steps: ['Look for the line with the widest margin.', 'Allow some mistakes (soft margin), controlled by C.', 'If no straight line works, use a kernel to curve the boundary.'],
    pros: ['Generalises well: the wide margin keeps it simple (low variance).'],
    cons: ['Training time grows roughly with rows².', 'Hard to explain.', 'Large C or gamma can overfit.']
  },
  bagging: {
    terms: [
      ['Ensemble', 'Many models combined. Works only if the models make different mistakes.'],
      ['Wisdom of crowds', 'The average of many guesses is often close to the truth.'],
      ['Bootstrap sample', 'Rows drawn at random with replacement: some repeat, some are left out.'],
      ['Bagging (bootstrap aggregating)', 'Many deep trees, each on its own bootstrap sample, combined by vote or average.'],
      ['Random forest', 'Bagging plus a random subset of features at each split, so the trees differ more.'],
      ['max_features', 'How many features each split may look at (sqrt = square root of the number of features).'],
      ['Variance', 'How much a model changes with different training data. Averaging lowers it.']
    ],
    steps: ['Make many bootstrap samples of the rows.', 'Train one deep tree on each sample (forest: random features at each split).', 'Combine: vote for classes, or average probabilities.'],
    pros: ['Lowers variance: each deep tree is jumpy, the average is stable.', 'Beats a single tree.'],
    cons: ['Does not fix bias.', 'Large models.']
  },
  boosting: {
    terms: [
      ['Boosting', 'Small trees trained in sequence, each fixing the errors of the team so far.'],
      ['Gradient boosting', 'Boosting where each new tree is trained on the remaining errors.'],
      ['Histogram-based gradient boosting', 'A fast version that groups values into bins first (HistGradientBoostingClassifier).'],
      ['Learning rate', 'How much of each new tree is added. Smaller = more careful.'],
      ['Early stopping', 'Stop adding trees when the validation score stops improving.'],
      ['Bias', 'Error from a model being too simple. Boosting attacks it directly.']
    ],
    steps: ['Train a small, simple tree.', 'Look at what it got wrong.', 'Train the next small tree to fix those errors.', 'Add it to the team, but only a little of it (the learning rate).', 'Repeat until the validation score stops improving (early stopping).'],
    pros: ['Lowers bias.', 'Often the most accurate on tables of data.'],
    cons: ['Many settings to tune.', 'Can overfit without a low learning rate and early stopping.'],
    compare: [['', 'Bagging / random forest', 'Boosting'], ['How trees are built', 'In parallel, independently', 'In sequence, each fixing the last'], ['Tree type', 'Deep trees', 'Small (shallow) trees'], ['Mainly reduces', 'Variance', 'Bias'], ['Picture', 'A crowd guessing at once', 'A student correcting mistakes one by one']]
  },
  voting: {
    terms: [
      ['Voting ensemble', 'Combines different kinds of models.'],
      ['Hard voting', 'Each model votes for a class; the majority wins.'],
      ['Soft voting', 'Average the predicted probabilities (usually better).'],
      ['Diversity', 'Models making different mistakes: the only way an ensemble gains.']
    ],
    pros: ['Can help when the models disagree in useful ways.'],
    cons: ['No gain when the models make the same mistakes.', 'More models to look after.']
  },
  search: {
    terms: [
      ['Parameter', 'Learned by the model from data: the weights, the split points.'],
      ['Hyper-parameter', 'Set by you before training: max_depth, k, C, learning rate.'],
      ['Grid search', 'Try every combination in a list. Good when there are few settings.'],
      ['Random search', 'Try a fixed number of random combinations. Better with many or continuous settings: usually only 1 or 2 settings really matter.'],
      ['Validation curve', 'Training and validation score plotted against one hyper-parameter.'],
      ['Golden rule', 'Score every setting with CV on the development data, never on the test set.']
    ]
  },
  overfitting: {
    terms: [
      ['Bias (underfitting)', 'Too simple: misses the real pattern. Darts all together but far from the bullseye.'],
      ['Variance (overfitting)', 'Too complex: memorises noise. Darts scattered everywhere.'],
      ['Bias-variance trade-off', 'Error = Bias² + Variance + Noise. The best model balances the first two.'],
      ['Noise', 'The part of the error no model can remove.'],
      ['Overfitting gap', 'Training score minus validation score. A big gap = overfitting.']
    ],
    steps: ['Compare training and validation scores.', 'Big gap → too complex: limit depth, raise leaf size, regularise, or stop early.', 'Both low → too simple: allow more complexity.']
  },
  auc: {
    terms: [
      ['Probability score', 'The model\'s number for each person (for example 0.82 or 0.31).'],
      ['Cut-off (threshold)', 'Above it = "yes". Each cut-off gives one (FPR, TPR) pair.'],
      ['True positive rate (TPR)', 'Recall: of the real cases, the share caught.'],
      ['False positive rate (FPR)', 'Of the healthy people, the share wrongly flagged: 1 − specificity.'],
      ['ROC curve', 'TPR plotted against FPR as the cut-off slides from 1 down to 0.'],
      ['AUC', 'Area under the ROC curve: the chance a random sick person scores higher than a random healthy one. 0.5 = coin flip, 0.7 okay, 0.8 good, 0.9+ excellent.']
    ],
    steps: ['The model gives each person a probability.', 'Pick a cut-off: above it = "yes". That gives one (FPR, TPR) point.', 'Slide the cut-off from 1 down to 0, plotting each point: the ROC curve.', 'AUC = the area under that curve.']
  },
  confusion: {
    terms: [
      ['Confusion matrix', 'A 2×2 table comparing what the model said with what was true.'],
      ['True positive (TP)', 'Really yes, predicted yes.'],
      ['True negative (TN)', 'Really no, predicted no.'],
      ['False positive (FP)', 'Really no, predicted yes: a false alarm.'],
      ['False negative (FN)', 'Really yes, predicted no: a miss. The dangerous one in medicine.'],
      ['Accuracy', '(TP + TN) / all: how often it is right overall.'],
      ['Recall (sensitivity, TPR)', 'TP / (TP + FN): of all real cases, how many we caught.'],
      ['Precision', 'TP / (TP + FP): of the people we flagged, how many were right.'],
      ['Specificity (TNR)', 'TN / (TN + FP): of the healthy people, how many we cleared.'],
      ['F1', '2 × P × R / (P + R): a balance of precision and recall.'],
      ['When accuracy lies', 'With 1% disease, always saying "no" is 99% accurate but useless. Balanced data makes accuracy fair.']
    ]
  },
  bootstrap: {
    terms: [
      ['Bootstrap', 'Re-using your own sample, drawn with replacement, to measure uncertainty.'],
      ['95% confidence interval', 'The middle 95% of the resampled scores: where the score would likely land if the test sample were drawn again.'],
      ['Percentile', 'The value below which a given share of results fall (2.5th, 97.5th).'],
      ['Paired bootstrap', 'Score both models on the same resample and record the difference.'],
      ['Really different (significant)', 'The 95% interval of the difference does not include 0.']
    ],
    steps: ['Draw 12,725 rows from the 12,725 test rows, with replacement.', 'Compute AUC on that resample.', 'Repeat 1,000 times → 1,000 AUCs.', 'The 2.5th to 97.5th percentile is the 95% CI.', 'Paired: do the same with the difference between two models.']
  },
  winner: {
    terms: [
      ['Standard error (SE)', 'How much an average could move by chance: SD / √(number of folds).'],
      ['One-standard-error rule', 'Models within one SE of the best score are tied; pick the simplest.'],
      ['Occam\'s razor', 'When two explanations work equally well, choose the simpler one.']
    ],
    steps: ['Find the model with the best mean CV score.', 'Compute its standard error.', 'Every model within one SE counts as tied.', 'Pick the simplest tied model.']
  },
  importance: {
    terms: [
      ['Feature importance', 'How much the model relies on each feature.'],
      ['Permutation importance', 'Shuffle one column and measure the drop in score. Works for any model.'],
      ['Correlation is not causation', 'Two things moving together doesn\'t mean one causes the other (ice cream and drownings: the hidden cause is hot weather).']
    ],
    steps: ['Score the model on the test set.', 'Shuffle one column, breaking its link to the target.', 'Score again and record the drop.', 'Repeat for every column (5 shuffles each here).']
  },
  cutoff: {
    terms: [
      ['Cut-off (threshold)', 'The probability above which a person is predicted "yes".'],
      ['Precision-recall trade-off', 'Lower cut-off: recall up, precision down. Higher: the opposite.'],
      ['Out-of-fold predictions', 'Predictions for each row from a model that never saw that row.']
    ]
  },
  limits: {
    terms: [
      ['Deployment', 'Putting the final model to use, retrained on all labelled data.'],
      ['Calibration', 'Adjusting probabilities so they match real-world rates.'],
      ['Cross-sectional data', 'Measured at one point in time, so it cannot show cause and effect.'],
      ['Nested cross-validation', 'An inner CV chooses settings and an outer CV scores the whole process.']
    ]
  },
  'at2-explore': {
    terms: [
      ['Nominal', 'Names or labels, no order. Allowed: = and ≠ (count, mode).'],
      ['Ordinal', 'Ordered, but gaps not equal. Adds < and > (median).'],
      ['Interval', 'Equal gaps, no true zero (°C). Adds + and − (mean).'],
      ['Ratio', 'Equal gaps and a true zero (weight, BMI). Adds × and ÷.'],
      ['Symmetric / asymmetric binary', 'Symmetric: both values matter equally (Sex). Asymmetric: one value is rare and more important (Stroke).'],
      ['Qualitative vs quantitative', 'Nominal and ordinal are categories; interval and ratio are numbers.'],
      ['Mean / median / mode', 'Average / middle value when sorted (not pulled by extremes) / most common value (the only one for nominal data).'],
      ['Range / variance / SD', 'max − min / average squared distance from the mean / square root of the variance.'],
      ['Quartiles and IQR', 'Q1 = 25% below, Q3 = 75% below. IQR = Q3 − Q1, the middle 50%.'],
      ['Coefficient of variation (CV)', 'SD / mean: compares spread between columns with different units.'],
      ['Skewness / kurtosis', 'Lopsidedness / how heavy the tails are.'],
      ['Pearson correlation', 'Linear relationship between two numeric columns (−1 to +1).'],
      ['Spearman correlation', 'Uses ranks: works for ordinal data and curved relationships.'],
      ['Chi-square test', 'Are two categorical columns related? Gives a p-value.'],
      ['Cramér\'s V', 'How strong that relationship is (0 to 1).'],
      ['Clustering', 'Grouping similar records without labels: high similarity inside a group, low between groups.'],
      ['k-means', 'Choose k, place k centres, assign each record to the nearest centre, move each centre to its group\'s mean, repeat.'],
      ['Elbow method', 'Plot within-cluster distance against k and pick the bend.'],
      ['k-medoids', 'Like k-means, but each centre must be a real record: more robust to outliers.'],
      ['Hierarchical clustering', 'Builds a tree of clusters (a dendrogram). AGNES merges bottom-up; DIANA splits top-down.'],
      ['Hard vs soft clustering', 'Hard: each record in exactly one cluster. Soft (fuzzy): partly in several.'],
      ['PCA', 'Squeezes many columns into a few that keep the most variation (used to plot the clusters).']
    ],
    steps: ['k-means step by step: choose k (for example 3).', 'Put k centre points at random.', 'Assign: each record joins its nearest centre.', 'Update: move each centre to the mean of its members.', 'Repeat assign and update until nothing changes.'],
    pros: ['k-means: simple and fast.'],
    cons: ['k-means: you must choose k, the result depends on the random start, it is sensitive to outliers, and it needs scaling.']
  },
  'at2-prep': {
    terms: [
      ['Binning', 'Grouping values into bins to reduce noise, keeping them as numbers.'],
      ['Equi-width (equal-width) binning', 'Equal-size intervals: width = (max − min) / bins. Easy, but uneven when data is skewed.'],
      ['Equi-depth (equal-frequency) binning', 'Each bin gets about the same number of values. Identical values must stay in the same bin.'],
      ['Smoothing by bin means', 'Replace each value with its bin\'s mean. Lowers variance.'],
      ['Smoothing by bin boundaries', 'Replace each value with the closest edge of its bin. Raises variance.'],
      ['Discretisation', 'Turning a number into named groups (labels), like Age codes → life stages.'],
      ['Binarisation', 'A two-value category becomes one 0/1 column.'],
      ['Normalisation', 'Min-max (0 to 1), z-score (mean 0, SD 1), decimal scaling (divide by a power of 10).']
    ],
    steps: ['Worked example, values 4, 8, 15, 21, 21, 24, 25, 28, 34 in 3 bins:', 'Equi-width: width (34 − 4) / 3 = 10 → [4, 14), [14, 24), [24, 34].', 'Equi-depth: 3 values each → {4, 8, 15}, {21, 21, 24}, {25, 28, 34}.', 'Smoothing by means: {4, 8, 15} → {9, 9, 9}.', 'Smoothing by boundaries: {4, 8, 15} → {4, 4, 15}.']
  }
  };
  CONTENT.topics.forEach(function (t) { var x = T[t.id]; if (x) for (var k in x) t[k] = x[k]; });
})();
