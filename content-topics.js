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
