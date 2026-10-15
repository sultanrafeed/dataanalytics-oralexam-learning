/* content-learn.js
   Home content, lesson parts, all Learn lessons, and the Glossary.
   PART 1 of 2: home, parts, lessons A (Big picture), B (Data preparation), C (Models).
   Sources: AT3 notebook (cells counted from 0), AT3 report, AT2 report, study guide.
   Edit text freely. Keep each "id" the same, because progress is saved by id. */
var CONTENT = window.CONTENT || (window.CONTENT = {});

CONTENT.home = {
  rubric: [
    { mark: "40", name: "Excellent", sees: "In-depth: multiple classifiers, valid preprocessing, parameter optimisation, model evaluation", evidence: "9 methods + baseline, pid leak found, 4 feature sets tested, grid/random search with 5-fold CV, test set + bootstrap CIs + paired test" },
    { mark: "30", name: "Good", sees: "Many classifiers, basic preprocessing, tuning and evaluation", evidence: "What you get if you only list things without saying why" },
    { mark: "20", name: "Pass", sees: "Can answer basic questions about the pipeline and evaluation", evidence: "Knowing what a train/test split is" }
  ],
  plan: [
    { day: 1, text: "Read sections 1 to 4. Say the 90-second story out loud 3 times with the notebook open" },
    { day: 2, text: "Learn the numbers (section 3). Answer Q1 to Q5 out loud using the 3-layer method" },
    { day: 3, text: "Walk through the notebook cell by cell (section 5) as if presenting. Time it: under 5 minutes" },
    { day: 4, text: "Go through questions 1 to 27 in section 8 and the AT2 table. Mark any you hesitate on" },
    { day: 5, text: "Full mock defence using Mock defence in this app: it asks, you answer, you score yourself Good or Excellent" }
  ]
};

CONTENT.parts = [
  { id: "A", title: "A. Big picture" },
  { id: "B", title: "B. Data preparation" },
  { id: "C", title: "C. Models" },
  { id: "D", title: "D. Tuning" },
  { id: "E", title: "E. Evaluation" },
  { id: "F", title: "F. Interpreting the model" },
  { id: "G", title: "G. AT2 preprocessing" },
  { id: "H", title: "H. Honest answers" },
  { id: "S", title: "Memory aid" }
];

CONTENT.learn = [];

/* ================= A. BIG PICTURE ================= */
CONTENT.learn.push(
{
  id: "task", part: "A", title: "The task: predict Diabetes_binary",
  plain: [
    "A **target** is the thing a model tries to predict.",
    "**Features** (also called **attributes**) are the inputs the model looks at.",
    "A **record** is one row of data. Here, one row is one person."
  ],
  project: [
    "The target is **Diabetes_binary**: 1 = prediabetes or diabetes, 0 = no diabetes.",
    "The inputs are **21 answers** from the **BRFSS** health survey (Behavioral Risk Factor Surveillance System).",
    "Most inputs are 0/1 flags such as HighBP, HighChol and DiffWalk."
  ],
  say: "My task was to predict Diabetes_binary from 21 BRFSS survey answers.",
  remember: [
    "**1 target, 21 inputs.**",
    "Diabetes_binary: **1 = prediabetes or diabetes, 0 = no diabetes.**"
  ],
  point: { cells: [0, 7], text: "The notebook title cell, then the Section 1 heading: 'The data mining problem and data check'." },
  recall: [
    { q: "What is the target?", a: "Diabetes_binary: 1 = prediabetes or diabetes, 0 = no diabetes." },
    { q: "How many input answers are there?", a: "21 answers from the BRFSS health survey." },
    { q: "Name two of the 0/1 flags.", a: "For example HighBP, HighChol or DiffWalk." }
  ]
},
{
  id: "problem-type", part: "A", title: "Supervised binary classification",
  plain: [
    "**Supervised** learning means the model learns from past examples where the answer is already known.",
    "**Classification** means the answer is a group, not a number.",
    "**Binary** means there are only two groups, called **classes**: here 1 or 0.",
    "Analogy: a teacher marks practice tests with the answers, then you sit a new test."
  ],
  project: [
    "This is a **supervised binary classification** task (notebook cell 7).",
    "The model learns from labelled survey records. Then it must predict Diabetes_binary for new people it has never seen."
  ],
  say: "It is a supervised binary classification problem. The model learns from labelled survey records and must predict Diabetes_binary for new people.",
  remember: [
    "**Supervised** = the answers are in the data.",
    "**Binary** = two classes, 1 or 0."
  ],
  point: { cells: [7], text: "Section 1 text: 'This is a supervised binary classification task.'" },
  recall: [
    { q: "What does 'supervised' mean?", a: "The model learns from examples where the answer is already known." },
    { q: "Why is it 'binary'?", a: "The target has only two classes: 1 or 0." },
    { q: "Say the problem type in one sentence.", a: "It is a supervised binary classification problem." }
  ]
},
{
  id: "screening-auc", part: "A", title: "Screening, and why ROC AUC is my main measure",
  plain: [
    "**Screening** means ranking many people by risk, then testing the highest-risk people first.",
    "A model gives each person a **score**. A **cut-off** (threshold) turns that score into yes or no.",
    "**ROC AUC** (or just **AUC**) checks how well the scores rank people, across every possible cut-off.",
    "AUC 0.5 means guessing. AUC 1.0 means perfect ranking."
  ],
  project: [
    "I treated the model as a **screening tool**: rank people by risk, and invite the highest-risk people for a blood test (cell 7).",
    "So my **main measure was ROC AUC**. I also report accuracy, precision, recall and F1.",
    "The cut-off can be chosen later, based on how many blood tests the client can pay for (report section 2)."
  ],
  say: "I treated it as a screening tool, so my main metric was ROC AUC. AUC measures ranking across every cut-off, and for screening the ranking matters first. The cut-off can be chosen later.",
  remember: [
    "Screening = **rank first, cut later.**",
    "If they ask 'why AUC?', I say: 'For screening, ranking matters first, and the cut-off can be chosen later.'"
  ],
  point: { cells: [7], text: "Section 1 text: 'Main measure: ROC AUC, because it checks how well the model ranks people across every cut-off.'" },
  recall: [
    { q: "What does screening mean here?", a: "Rank people by risk and invite the highest-risk people for a blood test." },
    { q: "Why ROC AUC and not one cut-off?", a: "AUC measures ranking across every cut-off. For screening, ranking comes first. The cut-off can be chosen later." },
    { q: "What does AUC 0.5 mean? And 1.0?", a: "0.5 means guessing. 1.0 means perfect ranking." }
  ]
},
{
  id: "marking", part: "A", title: "How I am marked: Pass, Good, Excellent",
  plain: [
    "A **rubric** is the marking guide. It describes what each mark level looks like.",
    "An **oral defence** is a short spoken exam where you explain and defend your own work."
  ],
  project: [
    "The defence is **5 minutes** and worth **40 marks**.",
    { table: { head: ["Mark", "What the marker sees", "My evidence"], rows: [
      ["**40 Excellent**", "In-depth: multiple classifiers, valid preprocessing, parameter optimisation, model evaluation", "9 methods + baseline, pid leak found, 4 feature sets tested, grid/random search with 5-fold CV, test set + bootstrap CIs + paired test"],
      ["**30 Good**", "Many classifiers, basic preprocessing, tuning and evaluation", "What you get if you only list things without saying why"],
      ["**20 Pass**", "Can answer basic questions about the pipeline and evaluation", "Knowing what a train/test split is"]
    ] } },
    "A 2 to 3 sentence answer gets to **Good (30)**. Adding the reason, a number from my results, and one trade-off gets to **Excellent (40)**."
  ],
  say: "I built one model for every method from Weeks 7 to 11, found and removed a leak, tested 4 feature sets, tuned with grid or random search and 5-fold cross-validation, and checked the winner on a test set with bootstrap confidence intervals and a paired test.",
  remember: [
    "**Pass = basics. Good = list it. Excellent = defend it.**",
    "Excellent = **reason + number + trade-off**."
  ],
  point: { cells: [], text: "No cell. This is about how you answer." },
  recall: [
    { q: "What turns a Good answer into an Excellent one?", a: "Adding the reason, a number from my results, and one trade-off." },
    { q: "How long is the defence, and how many marks?", a: "5 minutes, 40 marks." },
    { q: "What does a Pass (20) look like?", a: "Answering basic questions about the pipeline and evaluation, like knowing what a train/test split is." }
  ]
},
{
  id: "three-layers", part: "A", title: "The 3-layer answer: What, Evidence, Why",
  plain: [
    "A **trade-off** is when you gain one thing by giving up another.",
    "A good spoken answer is short, has a fact, and gives a reason."
  ],
  project: [
    { list: [
      "**1. What** (1 sentence): the direct answer.",
      "**2. Evidence** (1 sentence): the number and where it is in the notebook.",
      "**3. Why / trade-off** (1 to 2 sentences): the reasoning, an alternative I considered, and why I rejected it."
    ] },
    "Layers 1 and 2 alone = **Good**. Adding layer 3 = **Excellent**.",
    "Stop after layer 3 and let them ask the next question. Do not talk for more than about **40 seconds** per answer."
  ],
  say: "Gradient boosting performed best. CV AUC 0.829 and test AUC 0.835, shown in Section 4 and Section 6. Soft voting was tied, but it is three models for no real gain, so by my one-standard-error rule I chose the simpler one.",
  remember: [
    "**W-E-W: What, Evidence, Why.**",
    "**1 sentence, 1 sentence, 1 to 2 sentences. Then stop.**"
  ],
  point: { cells: [49, 54], text: "For the example: the CV results table (cell 49) and the test table (cell 54)." },
  recall: [
    { q: "Name the 3 layers in order.", a: "What, Evidence, Why / trade-off." },
    { q: "What must the Evidence layer include?", a: "A number and where it is in the notebook." },
    { q: "How long should one answer be?", a: "About 40 seconds at most. Stop after layer 3." }
  ]
},
{
  id: "golden-rules", part: "A", title: "The golden rules",
  plain: [
    "Examiners trust what they can see. Showing working code counts as evidence.",
    "Admitting a limit, with a plan to check it, sounds more expert than guessing."
  ],
  project: [
    { list: [
      "**Always point at the screen:** 'You can see it here in this cell.' Showing working code is part of the criteria.",
      "**Say numbers to 3 decimals** (0.835, not 0.83462).",
      "**If you don't know:** 'I didn't test that, but my expectation is X because Y. I would check it by Z.' This still sounds in-depth.",
      "**Never claim something the notebook does not show.**"
    ] }
  ],
  say: "I didn't test that, but my expectation is X because Y. I would check it by Z.",
  remember: [
    "**Point. Three decimals. Fallback. Only what the notebook shows.**",
    "Fallback = **X because Y, check by Z.**"
  ],
  point: { cells: [], text: "No cell. Use these rules in every answer." },
  recall: [
    { q: "How many decimals do you say numbers to?", a: "3 decimals, for example 0.835." },
    { q: "Say the fallback sentence.", a: "I didn't test that, but my expectation is X because Y. I would check it by Z." },
    { q: "What must you never do?", a: "Never claim something the notebook does not show." }
  ]
},
{
  id: "data", part: "A", title: "The data: rows, columns, balance, duplicates",
  plain: [
    "**Balanced classes** means each class appears equally often.",
    "**Prevalence** is how common a condition is in the real population.",
    "**Duplicates** are rows with exactly the same values.",
    "**Resampled** means the rows were picked to change the class mix."
  ],
  project: [
    "The file has **63,622 records and 23 columns**: pid (an ID), the target, and **21 attributes** (cell 6).",
    "Four attributes are ordinal codes: GenHlth, Age, Education and Income. BMI, MentHlth and PhysHlth are numbers. Sex is text. The rest are 0/1 flags.",
    "**No missing values.** The classes are **exactly balanced: 31,811 each** (cell 8).",
    "Real diabetes prevalence in BRFSS is **about 14%**, so this file was clearly resampled (report section 1).",
    "**1,365 duplicate rows** (2.1%), ignoring pid. I kept them."
  ],
  say: "There are no missing values, 1,365 duplicates that I kept, and the classes are exactly 50/50. Real prevalence is about 14%, so the file was resampled.",
  remember: [
    "**63,622 = 31,811 + 31,811.**",
    "**0 missing, 1,365 duplicates, 50/50, real 14%.**"
  ],
  point: { cells: [8], text: "The data check: `isna()`, `duplicated()`, `value_counts()`. Output: 'Missing values: 0', 'Duplicate rows (ignoring pid): 1365', and 31811 for each class." },
  recall: [
    { q: "How many rows and columns?", a: "63,622 rows and 23 columns: pid, the target and 21 attributes." },
    { q: "What is the class balance?", a: "Exactly 50/50: 31,811 in each class." },
    { q: "What is real prevalence, and what does it tell you?", a: "About 14%, so the file was resampled to be balanced." }
  ]
}
);

/* ================= B. DATA PREPARATION ================= */
CONTENT.learn.push(
{
  id: "pid-leak", part: "B", title: "The pid leak",
  plain: [
    "**Target leakage** is when an input secretly contains the answer.",
    "The model then looks perfect in testing but learns nothing useful.",
    "A **decision tree** asks yes/no questions. A tree with **one split** asks just one question.",
    "An ID number should carry no information about a person."
  ],
  project: [
    "pid is a record ID. Its values are **sorted by class**: every pid up to about 35,345 is class 0, and every pid above that is class 1 (report 3.1).",
    "I cut pid into **20 bands** and plotted the diabetes rate. It jumps from 0 to 1 (cell 10).",
    "A decision tree with **one split on pid** scored cross-validated **AUC 1.000** (cell 10 output: 'AUC using only pid: 1.0').",
    "So I **dropped pid**. On real patients, IDs have no such order, so a model using pid would fail."
  ],
  say: "First I checked the data. I found that pid leaks the label: low pids are all class 0 and high pids are all class 1. One split on pid gives AUC 1.0, so I dropped it.",
  remember: [
    "**One split, perfect score = leak.**",
    "If they ask 'it's just an ID, why drop it?', I say: 'Its values are sorted by class, so it gives away the answer.'"
  ],
  trap: "Do not say 'the file lists class 0 first'. Cell 6 shows the first rows are class 1. What is sorted by class is the **pid value**.",
  point: { cells: [10], text: "The pid plot (rate jumps from 0 to 1) and the output 'AUC using only pid: 1.0'." },
  recall: [
    { q: "How did you find the leak?", a: "I plotted the diabetes rate against 20 bands of pid and saw a jump from 0 to 1. Then a one-split tree on pid gave AUC 1.0." },
    { q: "Why would a model with pid fail on real patients?", a: "Real patient IDs have no such order, so pid would tell the model nothing." },
    { q: "What is target leakage?", a: "An input that secretly contains the answer." }
  ]
},
{
  id: "split", part: "B", title: "Train/test split and stratify",
  plain: [
    "The **test set** is data kept aside and used **once** at the end, for an honest score.",
    "The **development set** is everything else. It is used to build and tune models.",
    "To **stratify** means to keep the same class mix in both parts.",
    "A **seed** fixes the randomness, so results repeat exactly."
  ],
  project: [
    "`train_test_split(X, y, test_size=0.20, stratify=y, random_state=SEED)` with **SEED = 42** (cells 2 and 14).",
    "**Development set: 50,897 rows (80%). Test set: 12,725 rows (20%).**",
    "Stratify keeps the 50/50 balance in both parts. The test set is touched only once, in Section 6."
  ],
  say: "Then I held out 20% as a test set and did everything else on the other 80%. Stratify keeps the 50/50 balance in both parts, and the test set is touched only once, in Section 6.",
  remember: [
    "**80 / 20 = 50,897 / 12,725.**",
    "**Seed 42** everywhere, so every result can be repeated exactly."
  ],
  point: { cells: [14], text: "`train_test_split(..., test_size=0.20, stratify=y)`. Output: 'Development set: (50897, 21)', 'Test set: (12725, 21)'." },
  recall: [
    { q: "How big are the development and test sets?", a: "Development 50,897 rows (80%). Test 12,725 rows (20%)." },
    { q: "Why stratify?", a: "It keeps the 50/50 class balance in both parts." },
    { q: "When is the test set used?", a: "Only once, at the end, in Section 6." }
  ]
},
{
  id: "cv", part: "B", title: "Stratified 5-fold cross-validation",
  plain: [
    "**Cross-validation (CV)** splits data into k equal parts called **folds**.",
    "Train on all folds but one. Check on the one left out. Rotate until each fold has been checked, then average.",
    "The checked part is the **validation** part.",
    "**Stratified** CV keeps the class mix the same in every fold.",
    "You get a mean and a spread, instead of one lucky number."
  ],
  project: [
    "`cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=SEED)` is defined in cell 10.",
    "In each fold, about **40,718 rows train and 10,179 validate**.",
    "Every model used **the same 5 folds and ROC AUC**, so the scores can be compared directly."
  ],
  say: "I did everything else with stratified 5-fold cross-validation on the development set. Every model used the same 5 folds and the same metric, ROC AUC, so the scores can be compared directly.",
  remember: [
    "**5 folds: train on 4, check on 1, rotate 5 times.**",
    "**About 40,718 train, 10,179 validate** per fold."
  ],
  point: { cells: [10, 26], text: "The `StratifiedKFold` line in cell 10, and `cv=cv` inside the tune() function in cell 26." },
  recall: [
    { q: "How does 5-fold CV work?", a: "Split into 5 folds. Train on 4, validate on 1, rotate 5 times, and average." },
    { q: "Why use the same folds for every model?", a: "So every score is measured the same way and can be compared directly." },
    { q: "How many rows train and validate in each fold?", a: "About 40,718 train and 10,179 validate." }
  ]
},
{
  id: "pipelines", part: "B", title: "Pipelines and data leakage",
  plain: [
    "**Data leakage** is information from outside the training data getting into the model.",
    "To **fit** a step means to learn its numbers from data, such as a mean.",
    "A **pipeline** chains the preprocessing steps and the model together.",
    "In a pipeline, every step is fitted on the training data only."
  ],
  project: [
    "Two kinds of leakage here: (1) a feature that encodes the answer (**pid**), and (2) **preprocessing fitted on all the data** before splitting.",
    "All scaling, encoding and new features sit **inside scikit-learn pipelines** (cell 13 text, cell 19).",
    "In each fold, the scaler is fitted on the training part only. The validation part never leaks into its own preprocessing."
  ],
  say: "All preprocessing is inside pipelines, so nothing leaks between folds. In each fold the scaler is fitted on the training part only, so the validation part never leaks into its own preprocessing.",
  remember: [
    "**Two leaks: a column leak (pid) and a fitting leak (pipelines fix it).**"
  ],
  point: { cells: [19], text: "`steps_for(feature_set, scale)` builds the preprocessing steps that go inside each pipeline." },
  recall: [
    { q: "What are the two kinds of leakage in this project?", a: "A feature that encodes the answer (pid), and preprocessing fitted on all the data before splitting." },
    { q: "How do pipelines prevent leakage?", a: "The scaler and other steps are fitted on the training part of each fold only." },
    { q: "What does 'fit' mean for a scaler?", a: "Learn its numbers, like the mean and spread, from the data." }
  ]
},
{
  id: "cleaning", part: "B", title: "Cleaning: Sex to 0/1, keeping duplicates",
  plain: [
    "**Binarisation** turns a category into a 0/1 column.",
    "If a category has only two values, one 0/1 column is enough."
  ],
  project: [
    "Sex was the only text column. `X['Sex'] = (X['Sex'].str.lower() == 'male').astype(int)`: **male = 1** (cell 12).",
    "Two values only need one 0/1 column, as in AT2.",
    "pid and the target are dropped from the inputs X (cell 12).",
    "**Duplicates kept:** with 21 simple survey answers, two different people can easily answer the same way (report 3.2)."
  ],
  say: "I dropped pid, and turned Sex into 0/1 because two values only need one column. I kept the duplicates, because with 21 coarse survey answers two real people can answer identically.",
  remember: [
    "**Sex: 2 values → 1 column, male = 1.**",
    "If they ask 'why keep duplicates?', I say: 'Two real people can give the same 21 answers.'"
  ],
  point: { cells: [12], text: "`X = data.drop(columns=['pid', 'Diabetes_binary'])` and the Sex line." },
  recall: [
    { q: "How did you encode Sex?", a: "One 0/1 column, male = 1." },
    { q: "Why only one column for Sex?", a: "Two values only need one 0/1 column." },
    { q: "Why keep the duplicates?", a: "With 21 coarse survey answers, two real people can answer identically. Deleting them would change the class patterns." }
  ]
},
{
  id: "bmi-cap", part: "B", title: "Capping BMI at 60",
  plain: [
    "An **outlier** is a value far from the rest.",
    "**Capping** keeps the row but lowers any value above a limit to that limit."
  ],
  project: [
    "**231 records have BMI above 60**, up to 98 (report 3.2).",
    "`add_features` makes **BMI_clip = BMI capped at 60**, and BMI_clip replaces BMI (cell 16).",
    "These values are rare but possible, so I did not delete them. Capping stops a few extreme values controlling the distances in k-NN and the weights in linear models."
  ],
  say: "I capped BMI at 60 instead of deleting outliers. BMI above 60 is rare but possible, and those people are real high-risk cases. Capping keeps them but stops extreme values dominating distances and weights.",
  remember: [
    "**Cap, don't cut: 231 rows above 60.**"
  ],
  point: { cells: [16], text: "`df['BMI_clip'] = df['BMI'].clip(upper=60)` in add_features." },
  recall: [
    { q: "How many rows had BMI above 60?", a: "231 rows." },
    { q: "Why cap instead of delete?", a: "They are real high-risk people. Capping keeps them but stops extreme values dominating distances and weights." },
    { q: "Which models were most affected by extreme BMI?", a: "k-NN (distances) and linear models (weights)." }
  ]
},
{
  id: "scaling", part: "B", title: "Scaling: z-score vs min-max",
  plain: [
    "**Scaling** puts numbers on a similar range, so no input dominates just because its numbers are big.",
    "The **standard deviation (SD)** measures how spread out values are around the mean.",
    "**Z-score**: (value − mean) / SD. The mean becomes 0 and the spread becomes 1.",
    "**Min-max**: (value − min) / (max − min). Values are squeezed into 0 to 1."
  ],
  project: [
    "I used **z-score scaling** (`StandardScaler`) for the models that need it (cell 19).",
    "BMI has a **long right tail**. With min-max, the maximum sets the scale, so most values are squeezed into a narrow range.",
    "In AT2, min-max put about half of BMI values below 0.20 (median 0.192). Z-score handled that better (report 3.2)."
  ],
  say: "I used z-score, not min-max. BMI has a long right tail, so min-max squashes most values into a narrow range. Z-score handles that better, as I showed in AT2.",
  remember: [
    "**Min-max: the max sets the scale. Z-score: the mean and SD set it.**",
    "Long tail → **z-score**."
  ],
  point: { cells: [19], text: "`steps.append(('scale', StandardScaler()))  # z-score scaling`." },
  recall: [
    { q: "What is the z-score formula?", a: "(value − mean) / standard deviation." },
    { q: "Why not min-max for BMI?", a: "BMI has a long right tail, so the maximum sets the scale and squeezes most values into a narrow range." },
    { q: "Which scaler class did you use?", a: "StandardScaler (z-score)." }
  ]
},
{
  id: "who-scales", part: "B", title: "Which models need scaling, and why trees don't",
  plain: [
    "Models that measure **distance**, or learn weights in small steps, care about scale.",
    "A **tree** only asks questions like 'is BMI above 30?'. Rescaling BMI moves the threshold, but the split stays the same."
  ],
  project: [
    "`scale=True` adds a StandardScaler for **k-NN, logistic regression, the MLP and the SVM** (cell 19).",
    "Trees and the tree ensembles get the **unscaled** data.",
    "Without scaling, BMI would count far more than any 0/1 flag (report 3.2).",
    "On F2, the **0/1 dummy columns are left unscaled**: they are already 0 to 1, and leaving them keeps their meaning."
  ],
  say: "Trees don't need scaling. A tree only asks 'is BMI above 30?', so rescaling moves the threshold but not the split. k-NN, the SVM, logistic regression and the MLP do change with scale, so they get z-score scaling.",
  remember: [
    "**Distance, margin, gradient → scale. Trees → no scale.**",
    "k-NN = distance. SVM = margin. Logistic regression and MLP = gradient-trained."
  ],
  point: { cells: [19], text: "The `scale` argument in steps_for, and the ColumnTransformer that passes the dummy columns through unscaled." },
  recall: [
    { q: "Which models got scaled inputs?", a: "k-NN, logistic regression, the MLP and the SVM." },
    { q: "Why don't trees need scaling?", a: "A tree only asks 'is BMI above 30?'. Rescaling moves the threshold, not the split." },
    { q: "Why leave the 0/1 dummy columns unscaled?", a: "They are already on a 0 to 1 scale, and leaving them keeps their meaning." }
  ]
},
{
  id: "one-hot", part: "B", title: "One-hot encoding (for linear models only)",
  plain: [
    "An **ordinal** code is a number that shows order, like 1 = low up to 5 = high, but the gaps between codes are not equal.",
    "**One-hot encoding** turns one code into several 0/1 columns, one per level.",
    "A **linear model** adds up inputs times weights, so it treats code 4 as '4 times' code 1."
  ],
  project: [
    "`one_hot` encodes **GenHlth (1–5), Age (1–13), Income (1–8), Education (1–6) and BMI_cat (0–5)** (cell 16).",
    "One-hot is used only in **feature set F2**, for logistic regression, the MLP and the SVM.",
    "It lifted logistic regression from **0.8244 (F1) to 0.8261 (F2)** (cell 21)."
  ],
  say: "I one-hot encoded the ordinal codes for linear models only. A linear model treats Age code 13 as 13 times code 1, which forces a straight line. One-hot gives each band its own weight. Trees can split anywhere, so they don't need it.",
  remember: [
    "**Linear needs one-hot. Trees don't.**",
    "One-hot = **each band gets its own weight.**"
  ],
  point: { cells: [16], text: "The `one_hot(df)` function and its `levels` dictionary." },
  recall: [
    { q: "Which codes did you one-hot encode?", a: "GenHlth, Age, Income, Education and BMI_cat." },
    { q: "Why only for linear models?", a: "A linear model treats code 13 as 13 times code 1. Trees can split anywhere, so they don't need it." },
    { q: "How much did one-hot help logistic regression?", a: "From 0.8244 on F1 to 0.8261 on F2." }
  ]
},
{
  id: "features", part: "B", title: "The 9 new features: overview",
  plain: [
    "**Feature engineering** means making new inputs from existing ones.",
    "An **interaction** is two features that matter more together than apart.",
    "A **row-wise** feature uses only that row's own values, so it is safe inside a pipeline."
  ],
  project: [
    "`add_features` adds **9 new features** and caps BMI at 60 (cell 16):",
    { list: ["BMI_clip", "BMI_cat", "CardioCount", "BP_Chol", "Age_BMI", "Lifestyle", "FreqPhysDistress", "FreqMentDistress", "PoorHealth"] },
    "They use only each row's own values, so they are safe inside a pipeline.",
    "They are based on what AT2 showed and on basic health knowledge (report 3.3)."
  ],
  say: "I made 9 new features. They are row-wise, so they are safe in a pipeline: BMI capped at 60, WHO BMI bands, and interactions like HighBP times HighChol from my AT2 finding.",
  remember: [
    "**2 BMI + 2 heart + 1 age + 1 habits + 3 flags = 9.**",
    "BMI_clip, BMI_cat · CardioCount, BP_Chol · Age_BMI · Lifestyle · FreqPhysDistress, FreqMentDistress, PoorHealth."
  ],
  point: { cells: [16], text: "The `add_features(df)` function." },
  recall: [
    { q: "How many new features did you make?", a: "9." },
    { q: "Why are they safe inside a pipeline?", a: "They are row-wise: each uses only its own row's values." },
    { q: "Name the 9 features.", a: "BMI_clip, BMI_cat, CardioCount, BP_Chol, Age_BMI, Lifestyle, FreqPhysDistress, FreqMentDistress, PoorHealth." }
  ]
},
{
  id: "feat-bmi", part: "B", title: "Features 1 to 3: BMI_clip, BMI_cat, PoorHealth",
  plain: [
    "A **band** groups a number into ranges, like 'low', 'middle' and 'high'.",
    "A **flag** is a 0/1 column that says whether something is true."
  ],
  project: [
    { table: { head: ["Feature", "How it is made", "Why"], rows: [
      ["BMI_clip", "BMI capped at 60", "Stops extreme values having too much effect. Replaces BMI"],
      ["BMI_cat", "WHO bands: under 18.5, 18.5–25, 25–30, 30–35, 35–40, 40+ (coded 0 to 5)", "Risk goes up in steps with each obesity class"],
      ["PoorHealth", "GenHlth of 4 or 5", "Fair or poor self-rated health"]
    ] } },
    "Source: report Table 1 and cell 16."
  ],
  say: "BMI_clip caps BMI at 60. BMI_cat puts BMI into the WHO bands, because risk goes up in steps with each obesity class. PoorHealth flags fair or poor self-rated health, a GenHlth of 4 or 5.",
  remember: [
    "**Clip, Cat, Poor.**",
    "WHO cut points: **18.5, 25, 30, 35, 40.**"
  ],
  point: { cells: [16], text: "The BMI_clip, BMI_cat and PoorHealth lines in add_features." },
  recall: [
    { q: "What is BMI_cat?", a: "BMI in WHO bands: under 18.5, 18.5–25, 25–30, 30–35, 35–40, 40+." },
    { q: "What is PoorHealth?", a: "A flag for GenHlth of 4 or 5: fair or poor self-rated health." },
    { q: "What does BMI_clip replace?", a: "The original BMI column." }
  ]
},
{
  id: "feat-heart", part: "B", title: "Features 4 to 6: CardioCount, BP_Chol, Age_BMI",
  plain: [
    "A **count** feature adds several 0/1 flags into one score.",
    "A **product** feature multiplies two inputs, so it is high only when both are high."
  ],
  project: [
    { table: { head: ["Feature", "How it is made", "Why"], rows: [
      ["CardioCount", "HighBP + HighChol + HeartDiseaseorAttack + Stroke", "One score for the overall heart and metabolic burden"],
      ["BP_Chol", "HighBP × HighChol", "AT2 showed these two are much worse together"],
      ["Age_BMI", "Age × BMI_clip", "Extra weight is more risky at older ages"]
    ] } },
    "In the AT2 extract, people with both high blood pressure and high cholesterol had **74.5%** diabetes, vs **22.6%** with neither."
  ],
  say: "CardioCount adds up four heart and metabolic flags into one score. BP_Chol multiplies HighBP by HighChol, because in AT2 the two together gave 74.5% diabetes against 22.6% with neither. Age_BMI multiplies age by BMI, because extra weight is more risky at older ages.",
  remember: [
    "**Count, Cross, Combine:** CardioCount counts, BP_Chol crosses, Age_BMI combines.",
    "CardioCount = **4 flags**: HighBP, HighChol, HeartDiseaseorAttack, Stroke."
  ],
  point: { cells: [16], text: "The CardioCount, BP_Chol and Age_BMI lines in add_features." },
  recall: [
    { q: "Which 4 flags make CardioCount?", a: "HighBP, HighChol, HeartDiseaseorAttack and Stroke." },
    { q: "Where did the BP_Chol idea come from?", a: "AT2: both conditions gave 74.5% diabetes vs 22.6% with neither." },
    { q: "Why Age_BMI?", a: "Extra weight is more risky at older ages." }
  ]
},
{
  id: "feat-habits", part: "B", title: "Features 7 to 9: Lifestyle and the distress flags",
  plain: [
    "Several weak signals can be joined into one stronger score.",
    "A **threshold flag** is 1 when a number reaches a limit, otherwise 0."
  ],
  project: [
    { table: { head: ["Feature", "How it is made", "Why"], rows: [
      ["Lifestyle", "PhysActivity + Fruits + Veggies − Smoker − HvyAlcoholConsump", "Joins five weak habit flags into one"],
      ["FreqPhysDistress", "PhysHlth of 14 days or more", "CDC definition of frequent distress"],
      ["FreqMentDistress", "MentHlth of 14 days or more", "Same idea for mental health"]
    ] } },
    "Source: report Table 1 and cell 16."
  ],
  say: "Lifestyle joins five weak habit flags into one score: three good habits added, smoking and heavy drinking taken away. The two distress flags mark 14 or more bad days, which is the CDC definition of frequent distress.",
  remember: [
    "Lifestyle = **3 good habits plus, 2 bad habits minus.**",
    "Distress flags = **14 days or more.**"
  ],
  point: { cells: [16], text: "The Lifestyle and FreqPhysDistress / FreqMentDistress lines in add_features." },
  recall: [
    { q: "How is Lifestyle made?", a: "PhysActivity + Fruits + Veggies − Smoker − HvyAlcoholConsump." },
    { q: "What does FreqPhysDistress mean?", a: "PhysHlth of 14 days or more." },
    { q: "Where does the 14-day limit come from?", a: "The CDC definition of frequent distress." }
  ]
},
{
  id: "mutual-info", part: "B", title: "Mutual information, a filter method",
  plain: [
    "**Mutual information** scores how much one feature alone tells you about the target. 0 means nothing.",
    "A **filter method** picks features by scoring each one alone, before any model is trained."
  ],
  project: [
    "`mutual_info_classif` on the development set, with the new features added (cell 18).",
    "Five features scored **below 0.005**: NoDocbcCost, FreqMentDistress, HvyAlcoholConsump, MentHlth and AnyHealthcare.",
    "Those five are dropped in **feature set F3**.",
    "The highest scores were CardioCount, Age_BMI and GenHlth (report Figure 3)."
  ],
  say: "Mutual information is a filter method that scores each feature alone. Five scored below 0.005, and those are dropped in F3.",
  remember: [
    "**Five below 0.005 → F3.**",
    "Filter = **each feature alone.**"
  ],
  point: { cells: [18], text: "`low_mi = list(mi[mi < 0.005].index)` and the printed list of 5 features." },
  recall: [
    { q: "What does mutual information measure?", a: "How much one feature alone tells you about the target." },
    { q: "What was the cut-off for dropping features?", a: "Below 0.005." },
    { q: "Name the 5 dropped features.", a: "NoDocbcCost, FreqMentDistress, HvyAlcoholConsump, MentHlth and AnyHealthcare." }
  ]
},
{
  id: "feature-sets", part: "B", title: "The 4 feature sets, and what won",
  plain: [
    "A **feature set** is one chosen list of inputs.",
    "Testing several feature sets shows which inputs actually help each kind of model."
  ],
  project: [
    "**F0** raw (21 cleaned attributes), **F1** + new features, **F2** F1 + one-hot, **F3** F1 without the 5 low-MI features (cell 17).",
    "Four quick test models, same 5 folds (cell 21), CV AUC:",
    { table: { head: ["Model", "F0", "F1", "F2", "F3"], rows: [
      ["Decision tree (depth 8)", "0.8134", "0.8143", "0.8142", "0.8141"],
      ["Gradient boosting", "0.8279", "0.8280", "0.8277", "0.8264"],
      ["Logistic regression", "0.8230", "0.8244", "0.8261", "0.8244"],
      ["k-NN (k=51)", "0.8118", "0.8157", "0.8141", "0.8154"]
    ] } },
    "**Decision:** linear models (logistic regression, MLP, SVM) use **F2**. Trees, ensembles and k-NN use **F1** (cell 24)."
  ],
  say: "I tested whether the features helped. They lifted k-NN from 0.812 to 0.816 and logistic regression from 0.823 to 0.826, but barely changed boosting, because trees already find interactions themselves.",
  remember: [
    "**F0 raw, F1 +features, F2 +one-hot, F3 filtered.**",
    "**Linear → F2. Trees and k-NN → F1. F3 → dropped.**"
  ],
  point: { cells: [21, 24], text: "The feature-set table in cell 21, and `LINEAR_FS = 'F2'`, `TREE_FS = 'F1'` in cell 24." },
  recall: [
    { q: "What are F0 to F3?", a: "F0 raw, F1 plus new features, F2 plus one-hot, F3 filtered by mutual information." },
    { q: "Which feature set did linear models use? And trees?", a: "Linear models F2. Trees, ensembles and k-NN F1." },
    { q: "Why did the features barely help boosting?", a: "Boosted trees already find these combinations from the raw data." }
  ]
},
{
  id: "f3-trap", part: "B", title: "Why F3 hurt: the HvyAlcoholConsump trap",
  plain: [
    "A feature can look useless alone but matter once other features are known.",
    "This is called **conditional relevance**. Filter methods cannot see it."
  ],
  project: [
    "F3 made gradient boosting worse: **0.8280 → 0.8264** (cell 21).",
    "One dropped feature was **HvyAlcoholConsump**. It scores low alone, but matters once age and BMI are known (cell 23, report 3.4).",
    "Heavy drinkers in this data have a diabetes rate of **27.8%**, compared with **51.0%** for everyone else.",
    "So I did not use F3."
  ],
  say: "F3 hurt because mutual information judges each feature alone. HvyAlcoholConsump scores low alone but matters once age and BMI are known: heavy drinkers have 27.8% diabetes against 51.0%. Filter methods miss conditional relevance.",
  remember: [
    "**Low alone, useful together.**",
    "Alcohol: **27.8% vs 51.0%.**"
  ],
  trap: "Do not mix AT2 and AT3 alcohol numbers. AT3: 27.8% vs 51.0% for everyone else. AT2 (3,000-row extract): 24.1% vs 51.4% overall.",
  point: { cells: [21, 23], text: "The F3 column for gradient boosting in cell 21, and the result text in cell 23." },
  recall: [
    { q: "How much did F3 change boosting?", a: "It dropped from 0.8280 to 0.8264." },
    { q: "Why does HvyAlcoholConsump still matter?", a: "It scores low alone, but matters once age and BMI are known." },
    { q: "What is the weakness of filter methods?", a: "They judge each feature alone, so they miss conditional relevance." }
  ]
}
);

/* ================= C. MODELS ================= */
CONTENT.learn.push(
{
  id: "baseline", part: "C", title: "Majority-class baseline",
  plain: [
    "A **baseline** is the simplest possible model. Any real model should beat it.",
    "A **majority-class** baseline always predicts the most common class."
  ],
  project: [
    "`DummyClassifier(strategy='most_frequent')` (cell 28).",
    "CV AUC **0.5000**. It always predicts one class, so it cannot rank anyone.",
    "It shows the floor. It was left out of the test-set table (cell 54)."
  ],
  say: "I also used a majority-class baseline as the floor, which scores AUC 0.5.",
  remember: [
    "**Baseline = the floor = AUC 0.5.**"
  ],
  point: { cells: [28], text: "`tune('Baseline', ...)` and the output 'Baseline: CV AUC 0.5000'." },
  recall: [
    { q: "What does a majority-class baseline do?", a: "It always predicts the most common class." },
    { q: "What AUC did it score?", a: "0.5." },
    { q: "Why include it?", a: "It shows the floor that every real model should beat." }
  ]
},
{
  id: "tree", part: "C", title: "Decision tree (Week 7)",
  plain: [
    "A **decision tree** asks yes/no questions, one after another. Each answer sends you down a branch.",
    "At each step it picks the split that makes groups **purest** (mostly one class).",
    "**Gini** and **entropy** are two purity measures. Splitting by entropy is called **information gain**, as in ID3.",
    "A **leaf** is a final group. **max_depth** = how many questions in a row. **min_samples_leaf** = the fewest people allowed in a leaf."
  ],
  project: [
    "Grid search: criterion (gini, entropy) × max_depth (4, 6, 8, 10, 12, 16, None) × min_samples_leaf (1, 20, 50, 100, 200) = **70 combinations** (cell 30).",
    "Best: **entropy, depth 8, min leaf 200**. CV AUC **0.8158** ± 0.0030. Gini was almost the same, at 0.8152 (report 4.1).",
    "Test AUC **0.8220**, the lowest of the tuned models (cell 54).",
    "**Weakness:** deep trees memorise the data (high variance), and trees are unstable."
  ],
  say: "My decision tree used entropy, depth 8 and a minimum leaf of 200, with CV AUC 0.816. It was the weakest tuned model, at 0.822 on test. Deep trees memorise the data, so the depth and leaf limits matter.",
  remember: [
    "**Tree = a game of 20 questions.** Depth = how many questions. Leaf = the smallest final group.",
    "**Entropy, 8, 200 → 0.816.**"
  ],
  point: { cells: [30], text: "The tree search: `model__criterion`, `model__max_depth`, `model__min_samples_leaf`, and the output line." },
  recall: [
    { q: "How does a decision tree choose a split?", a: "It picks the split that makes the groups purest, by Gini or entropy." },
    { q: "What were the best tree settings?", a: "Entropy, depth 8, minimum leaf 200. CV AUC 0.816." },
    { q: "What is the tree's main weakness?", a: "Deep trees memorise the data (high variance) and are unstable." }
  ]
},
{
  id: "knn", part: "C", title: "k-NN (Week 8)",
  plain: [
    "**k-NN** (k-nearest neighbours) finds the k most similar people and takes their majority.",
    "**Distance** measures how different two people are.",
    "**Euclidean** distance is the straight line. **Manhattan** distance adds up the differences step by step.",
    "**weights**: uniform (all neighbours count equally) or distance (closer neighbours count more)."
  ],
  project: [
    "Grid: k (25, 51, 101, 201, 301) × weights × metric = **20 settings** (cell 33).",
    "Best: **k = 201, uniform, Manhattan**. CV AUC **0.8203** ± 0.0025. Test **0.8265**.",
    "Inputs are scaled so BMI does not outweigh the 0/1 flags (cell 32).",
    "Training score skipped: each point is its own neighbour, so it means nothing and is slow (cell 32).",
    "**Weakness:** needs scaling, slow to predict, struggles with many 0/1 ties."
  ],
  say: "k-NN needed k = 201 with Manhattan distance. Most features are 0/1, so many people are at exactly the same distance. A small k gives noisy votes, and a large k smooths them.",
  remember: [
    "**k = 201, Manhattan, uniform → 0.820.**",
    "Many 0/1 ties → **big neighbourhood.**"
  ],
  point: { cells: [33, 34], text: "The k-NN search in cell 33 and the 'k vs AUC' plot in cell 34." },
  recall: [
    { q: "How does k-NN decide?", a: "It finds the k most similar people and takes their majority." },
    { q: "Why did k-NN need k = 201?", a: "Most features are 0/1, so many people tie on distance. A large k smooths the noisy votes." },
    { q: "Why did Manhattan beat Euclidean?", a: "It counts each 0/1 difference as one step, so no single attribute takes over." }
  ]
},
{
  id: "logreg", part: "C", title: "Logistic regression (Week 9)",
  plain: [
    "**Logistic regression** adds up inputs times weights. A **sigmoid** curve then turns the sum into a probability between 0 and 1.",
    "Its boundary between the classes is a straight line, so it is a **linear** model.",
    "**Overfitting** means learning noise in the training data, so new data scores worse.",
    "**Regularisation** keeps weights small to reduce overfitting. **C** is its inverse: small C = stronger regularisation.",
    "**L1** can set useless weights to zero. **L2** shrinks all weights."
  ],
  project: [
    "Grid: C (0.001, 0.01, 0.1, 1, 10) × penalty (L1, L2) = **10 settings**, on F2 (cell 36).",
    "Best: **C = 0.01, L2**. CV AUC **0.8264** ± 0.0036. Overfitting gap **0.001** (cell 49).",
    "Test AUC **0.8323** (cell 54). It was the strongest rival, but boosting beat it by 0.0023, a real difference (cell 57).",
    "It trains in 0.3 seconds and is easy to explain. It would be the backup model if the client needed a simple points-based score (report 5.2).",
    "**Weakness:** it can't find interactions unless you give them."
  ],
  say: "Logistic regression is my linear classifier. The best was C = 0.01, strong L2 regularisation, with CV AUC 0.826 and almost no overfitting gap. But it can't find interactions unless I give them, and boosting beat it by a difference the paired test showed is real.",
  remember: [
    "**Small C = small weights.**",
    "**C 0.01, L2, gap 0.001.**"
  ],
  point: { cells: [36], text: "The logistic regression search: `model__C` and `model__penalty`." },
  recall: [
    { q: "How does logistic regression make a prediction?", a: "A weighted sum of inputs passed through a sigmoid to give a probability." },
    { q: "What does a small C mean?", a: "Stronger regularisation: weights are kept small." },
    { q: "Best settings and CV AUC?", a: "C = 0.01, L2. CV AUC 0.826." }
  ]
},
{
  id: "mlp", part: "C", title: "MLP, a small neural network (Week 9)",
  plain: [
    "An **MLP** (multi-layer perceptron) is a small neural network made of layers of **neurons**.",
    "Each layer re-combines the last one, so it can learn curved boundaries.",
    "The **activation** (relu or tanh) is the bend each neuron adds.",
    "**alpha** is an L2 penalty. **learning_rate_init** is the starting step size.",
    "**Early stopping** holds back part of the training data and stops when that part stops improving."
  ],
  project: [
    "**Random search over 16 settings**: hidden layers (8), (16), (32), (64), (32, 16), (64, 32), alpha, learning rate, relu or tanh (cell 38).",
    "`early_stopping=True` holds back 10% of each training fold (cell 37).",
    "Best: **one layer of 64 tanh neurons, alpha 0.062**. CV AUC **0.8270** ± 0.0026. Gap 0.007.",
    "Test **0.8335**. It was the best model that is not tree-based (report 4.1).",
    "The best one-layer and two-layer networks were within 0.0003 AUC, so I kept the simpler one.",
    "**Weakness:** a black box, and it depends on starting weights and scaling."
  ],
  say: "The MLP used a random search over 16 settings. The best was one layer of 64 tanh neurons, with CV AUC 0.827. It was the best non-tree model, but it is a black box and depends on its starting weights, so it was no reason to give up explainability.",
  remember: [
    "**1 × 64 tanh → 0.827.**",
    "MLP = **layers re-combining layers.**"
  ],
  point: { cells: [38], text: "`MLPClassifier(early_stopping=True, ...)` and `hidden_layer_sizes`." },
  recall: [
    { q: "What were the best MLP settings?", a: "One layer of 64 tanh neurons, alpha 0.062." },
    { q: "How many settings were tried, and how?", a: "16, by random search." },
    { q: "What is the MLP's weakness?", a: "It is a black box and depends on starting weights and scaling." }
  ]
},
{
  id: "svm", part: "C", title: "SVM (Week 10)",
  plain: [
    "An **SVM** (support vector machine) finds the boundary with the widest **margin**, the gap between the classes.",
    "A **kernel** lets the boundary bend. **Linear** = straight. **RBF** = curved and local.",
    "**C** sets how much to punish mistakes. **gamma** sets how local the RBF curve is."
  ],
  project: [
    "Kernel SVMs are very slow on big data, so the search ran on a **sample of 10,000 records** (cell 39, cell 40).",
    "Grid: linear with C (0.01, 0.1, 1), plus RBF with C (0.3, 1, 3) × gamma (0.003, 0.01, 0.03) = **12 settings**.",
    "Best: **linear kernel, C = 0.01**. Sample CV **0.8323** (SD 0.0103). Re-scored on the full development set: **0.8256** (cell 41).",
    "Test **0.8315**.",
    "**Weakness:** training cost grows roughly with rows², and it is hard to explain."
  ],
  say: "For the SVM, the search ran on a 10,000-row sample for speed, but I re-scored the winner on the full data. The sample score of 0.832 was noisy and would have wrongly ranked it first. On the full data it was 0.826.",
  remember: [
    "**Sample 0.832 → full 0.826.**",
    "Best kernel: **linear, C = 0.01.**"
  ],
  point: { cells: [40, 41], text: "`train_size=10000` in cell 40, and the two printed scores in cell 41." },
  recall: [
    { q: "How does an SVM decide?", a: "It finds the boundary with the widest margin between the classes." },
    { q: "Why search on a sample?", a: "Kernel SVM training time grows roughly with rows², so the full data was too slow." },
    { q: "Sample score vs full score?", a: "0.832 on the sample, 0.826 on the full development set." }
  ]
},
{
  id: "bagging", part: "C", title: "Bagging (Week 11)",
  plain: [
    "A **bootstrap sample** draws rows at random **with replacement**, so some rows repeat and some are left out.",
    "**Bagging** trains many trees, each on its own bootstrap sample, then averages them.",
    "An **ensemble** is a model made of many models.",
    "**Variance** is how much a model changes with different training data. Averaging lowers it."
  ],
  project: [
    "`BaggingClassifier` with **50 trees** (cell 43).",
    "Grid: max_samples (0.3, 0.6, 1.0) × min leaf (1, 20, 50) = **9 settings**.",
    "Best: **30% samples, min leaf 20**. CV AUC **0.8239** ± 0.0034. Gap **0.025**.",
    "Test **0.8293**.",
    "**Weakness:** it lowers variance, not bias."
  ],
  say: "Bagging trains many trees in parallel on bootstrap samples and averages them, which lowers variance. My best used 30% samples and a minimum leaf of 20, with CV AUC 0.824. But it does not fix bias, and here the errors were mostly bias.",
  remember: [
    "**Bagging = many trees in parallel, averaged.**",
    "**30% samples, leaf 20 → 0.824.**"
  ],
  point: { cells: [43], text: "`BaggingClassifier(DecisionTreeClassifier(...), n_estimators=50, ...)` and its search." },
  recall: [
    { q: "What is a bootstrap sample?", a: "Rows drawn at random with replacement." },
    { q: "What does bagging lower?", a: "Variance." },
    { q: "Best bagging settings?", a: "30% samples, minimum leaf 20. CV AUC 0.824." }
  ]
},
{
  id: "forest", part: "C", title: "Random forest (Week 11)",
  plain: [
    "A **random forest** is bagging plus a twist: each split may only look at a random subset of features.",
    "This makes the trees more different from each other, so averaging helps more.",
    "**max_features** sets how many features each split may look at. **sqrt** = the square root of the number of features."
  ],
  project: [
    "`RandomForestClassifier` with **300 trees** (cell 44).",
    "**Random search, 14 settings**: depth (8, 12, 16, None), min leaf (1, 5, 10, 20, 40), max_features (sqrt, 0.3, 0.5).",
    "Best: **depth 16, min leaf 20, sqrt**. CV AUC **0.8254** ± 0.0030.",
    "**Biggest overfitting gap: 0.032** (cell 49). Test **0.8315**.",
    "**Weakness:** it still overfits, and it is a large model."
  ],
  say: "The random forest is bagging plus a random subset of features at each split. Its best was depth 16, leaf 20, sqrt features, with CV AUC 0.825. It had the biggest overfitting gap, 0.032.",
  remember: [
    "**Forest = bagging + random features.**",
    "**Biggest gap: 0.032.**"
  ],
  point: { cells: [44, 49], text: "The forest search in cell 44, and its gap in the CV table (cell 49)." },
  recall: [
    { q: "How is a random forest different from bagging?", a: "Each split looks at a random subset of features, so the trees differ more." },
    { q: "Best forest settings?", a: "Depth 16, minimum leaf 20, sqrt features. CV AUC 0.825." },
    { q: "Which model had the biggest overfitting gap?", a: "The random forest, 0.032." }
  ]
},
{
  id: "boosting", part: "C", title: "Gradient boosting (Week 11): my chosen model",
  plain: [
    "**Gradient boosting** builds small trees one after another. Each new tree fixes the errors left so far.",
    "**Bias** is error from a model being too simple. Boosting lowers bias.",
    "**learning_rate** is the size of each fix. Smaller = more careful.",
    "**max_leaf_nodes** sets tree size. **l2_regularization** penalises big leaf values."
  ],
  project: [
    "`HistGradientBoostingClassifier` with early stopping: up to 1,000 trees, 10% held back, stop after 30 rounds with no gain (cell 45).",
    "**Random search, 25 settings.**",
    "Best: **learning rate 0.033, 23 max leaves, min leaf 290, L2 0.13, 43% of features**. Early stopping picked **287 trees** (report Table 2).",
    "CV AUC **0.8293** ± 0.0030. Gap **0.012**.",
    "Test AUC **0.8346** (95% CI 0.828 to 0.841). Accuracy 75.5%, precision 73.5%, recall 79.8%, F1 0.765 (cell 54).",
    "**Weakness:** many settings to tune, and it can overfit without early stopping."
  ],
  say: "Gradient boosting. It had the highest cross-validated AUC, 0.829, and on the untouched test set it scored AUC 0.835 with 75.5% accuracy and 79.8% recall.",
  remember: [
    "**Boosting = small trees in sequence, each fixing the last.**",
    "**0.033 · 23 · 290 · 0.13 · 43% · 287.**"
  ],
  point: { cells: [45], text: "The boosting search and its output: 'Gradient boosting: CV AUC 0.8293 (+/- 0.0030)'." },
  recall: [
    { q: "How does gradient boosting work?", a: "Small trees are added one after another, each fixing the errors left so far." },
    { q: "CV AUC and test AUC of boosting?", a: "CV 0.829, test 0.835." },
    { q: "How many trees did early stopping pick?", a: "287 trees." }
  ]
},
{
  id: "voting", part: "C", title: "Soft voting (Week 11)",
  plain: [
    "A **voting ensemble** combines different models.",
    "**Soft voting** averages their predicted probabilities."
  ],
  project: [
    "`VotingClassifier` of **boosting, logistic regression and the MLP**, `voting='soft'` (cell 47).",
    "CV AUC **0.8291** ± 0.0032, tied with boosting.",
    "Test **0.8351** (95% CI 0.828 to 0.842), just 0.0005 above boosting.",
    "Paired bootstrap difference: **−0.0014 to +0.0004**. It includes 0, so they are tied (cell 57).",
    "It gave no gain because all three models make similar mistakes. They lean on the same strong signals: general health, BMI, age and blood pressure (report 5.2)."
  ],
  say: "Soft voting scored 0.8351 against 0.8346, a difference of 0.0005, and the paired bootstrap interval, minus 0.0014 to plus 0.0004, includes zero. So it's a tie, and my rule picks the simpler model. I set the rule before looking at test results, so I couldn't cherry-pick.",
  remember: [
    "**Three models, no real gain.**",
    "If they ask 'voting scored higher, why not pick it?', I say: 'The difference includes zero, so it's a tie, and my rule picks the simpler model.'"
  ],
  point: { cells: [47, 57], text: "The VotingClassifier in cell 47, and the 'Soft voting' row of the paired test in cell 57." },
  recall: [
    { q: "Which models are in the soft-voting ensemble?", a: "Gradient boosting, logistic regression and the MLP." },
    { q: "Why did voting not help?", a: "All three make similar mistakes." },
    { q: "What was the paired interval for boosting vs voting?", a: "−0.0014 to +0.0004. It includes 0, so it is a tie." }
  ]
},
{
  id: "bag-vs-boost", part: "C", title: "Bagging vs boosting",
  plain: [
    "**Bagging**: many trees trained side by side (in parallel), then averaged. This lowers **variance**.",
    "**Boosting**: small trees trained one after another (in sequence), each fixing the last one's errors. This lowers **bias**."
  ],
  project: [
    "Random forest and bagging had the biggest gaps: **0.032 and 0.025**.",
    "Boosting's gap stayed small at **0.012**, thanks to a small learning rate, big leaves and early stopping (report 4.1).",
    "Here the errors came mostly from bias, and boosting deals with bias directly (report 5.2)."
  ],
  say: "Bagging trains trees in parallel on bootstrap samples and averages them, which lowers variance. Boosting trains small trees in sequence, each fixing the last one's errors, which lowers bias. Here the errors were mostly bias, so boosting won.",
  remember: [
    "**Bagging: parallel → variance. Boosting: sequence → bias.**"
  ],
  point: { cells: [42], text: "The Section 4 note before cell 43: 'Bagging ... (lowers variance)' and 'Gradient boosting ... (lowers bias)'." },
  recall: [
    { q: "Bagging lowers what? Boosting lowers what?", a: "Bagging lowers variance. Boosting lowers bias." },
    { q: "Why did boosting win here?", a: "The errors were mostly bias, and boosting deals with bias directly." },
    { q: "Gaps of forest, bagging and boosting?", a: "0.032, 0.025 and 0.012." }
  ]
},
{
  id: "rbf-linear", part: "C", title: "Why RBF did not beat linear",
  plain: [
    "A curved boundary only helps if the data really needs one.",
    "A more complex model can add cost without adding accuracy."
  ],
  project: [
    "The SVM search picked the **linear kernel, C = 0.01** over every RBF setting (cell 40).",
    "Logistic regression and the linear SVM both picked C = 0.01, which is strong regularisation (report 4.1).",
    "After one-hot encoding, a straight boundary already gets most of what the data can give, so the kernel only added time."
  ],
  say: "After one-hot encoding, a straight boundary already captures most of the signal. The RBF kernel added cost but no accuracy, so the linear kernel won.",
  remember: [
    "**One-hot makes straight lines good enough.**"
  ],
  point: { cells: [40], text: "The SVM grid: linear and RBF settings, and the output 'best settings: C 0.01, linear'." },
  recall: [
    { q: "Which SVM kernel won?", a: "Linear, with C = 0.01." },
    { q: "Why didn't RBF help?", a: "After one-hot encoding, a straight boundary already captures most of the signal." },
    { q: "Which two models both chose C = 0.01?", a: "Logistic regression and the linear SVM." }
  ]
},
{
  id: "model-map", part: "C", title: "Model map: all 10 models on one page",
  plain: [
    "Seeing all models side by side shows a pattern: very different ideas, very similar scores."
  ],
  project: [
    { table: { head: ["Model", "How it decides", "Key setting", "CV AUC", "Test AUC", "Weakness"], rows: [
      ["Baseline", "Always predicts one class", "most_frequent", "0.5000", "not tested", "Cannot rank anyone"],
      ["Decision tree", "Yes/no questions, purest split", "Entropy, depth 8, leaf 200", "0.8158", "0.8220", "High variance, unstable"],
      ["k-NN", "Majority of k most similar people", "k = 201, Manhattan", "0.8203", "0.8265", "Needs scaling, 0/1 ties"],
      ["Logistic regression", "Weighted sum + sigmoid, straight boundary", "C = 0.01, L2", "0.8264", "0.8323", "No interactions unless given"],
      ["MLP", "Layers re-combining layers", "1 × 64 tanh", "0.8270", "0.8335", "Black box"],
      ["SVM", "Widest margin", "Linear, C = 0.01", "0.8256", "0.8315", "Cost grows with rows²"],
      ["Bagging", "Many trees on bootstrap samples, averaged", "30% samples, leaf 20", "0.8239", "0.8293", "Lowers variance, not bias"],
      ["Random forest", "Bagging + random features per split", "Depth 16, leaf 20, sqrt", "0.8254", "0.8315", "Still overfits, large"],
      ["Gradient boosting", "Small trees in sequence, fixing errors", "lr 0.033, 23 leaves, 287 trees", "0.8293", "0.8346", "Many settings to tune"],
      ["Soft voting", "Average of boosting, logistic regression, MLP", "3 members", "0.8291", "0.8351", "No gain: similar mistakes"]
    ] } },
    "Sources: cell 49 (CV), cell 54 (test). All nine tuned models are within **0.013** AUC on test."
  ],
  say: "They cover different ideas on purpose. The tree and the ensembles split the data into rules. k-NN uses distance. Logistic regression and the linear SVM draw a straight boundary. The MLP learns non-linear combinations. All nine were within 0.013 AUC, which tells me the limit comes from the data, not the algorithm.",
  remember: [
    "**Rules, distance, straight line, curves, all within 0.013.**",
    "CV top three: **boosting 0.8293, voting 0.8291, MLP 0.8270.**"
  ],
  point: { cells: [49], text: "The CV results table, sorted from best to worst." },
  recall: [
    { q: "Which model was worst after tuning?", a: "The decision tree: CV 0.816, test 0.822." },
    { q: "How far apart were all nine tuned models on test?", a: "Within 0.013 AUC." },
    { q: "What does that spread tell you?", a: "The limit comes from the data, not the algorithm." }
  ]
}
);
/* ===== END OF PART 1 of 2 ===== */

/* content-learn.js
   PART 2 of 2: lessons D (Tuning), E (Evaluation), F (Interpreting), G (AT2), H (Honest answers),
   the Number story, and the Glossary. */

/* ================= D. TUNING ================= */
CONTENT.learn.push(
{
  id: "tune-fn", part: "D", title: "The tune() function: same folds, same metric",
  plain: [
    "**Hyper-parameters** are settings you choose before training, like the depth of a tree.",
    "**Tuning** means trying many settings and keeping the one that scores best on validation data."
  ],
  project: [
    "One function, `tune()`, tunes every model (cell 26).",
    "It always uses the **same folds** (`cv=cv`) and the **same metric** (`scoring='roc_auc'`).",
    "For the best setting (`best_index_`) it records the **CV AUC**, its **spread** (SD) and the **training AUC** (`mean_train_score`).",
    "Each finished search is saved with `checkpoint`, so a Colab disconnect never loses it."
  ],
  say: "One function tunes every model: same folds, same metric. It records the CV AUC, its spread and the training AUC, so I can see overfitting. The best setting of each model then goes into the final comparison.",
  remember: [
    "**Same folds, same metric, three numbers: CV AUC, SD, training AUC.**"
  ],
  point: { cells: [26], text: "`GridSearchCV` / `RandomizedSearchCV`, `scoring='roc_auc'`, `best_index_`, `mean_train_score`." },
  recall: [
    { q: "What does tune() keep the same for every model?", a: "The same 5 folds and the same metric, ROC AUC." },
    { q: "Which three numbers does it record?", a: "The CV AUC, its spread (SD), and the training AUC." },
    { q: "Why record the training AUC?", a: "To see overfitting: the gap between training and validation AUC." }
  ]
},
{
  id: "grid-random", part: "D", title: "Grid search vs random search",
  plain: [
    "**Grid search** tries every combination of the settings you list.",
    "**Random search** tries a fixed number of random combinations.",
    "Random search covers many settings faster, especially settings that can take any value in a range."
  ],
  project: [
    "**GridSearchCV** when there were few settings: tree (70), k-NN (20), logistic regression (10), SVM (12), bagging (9).",
    "**RandomizedSearchCV** when there were many: MLP (16), random forest (14), boosting (25).",
    "Every search used stratified 5-fold CV on the development set and scored ROC AUC (cell 26)."
  ],
  say: "I used GridSearchCV when there were few settings, and RandomizedSearchCV when there were many, like the MLP, random forest and boosting. Random search covers the important settings faster. Every search used the same stratified 5-fold cross-validation and scored ROC AUC.",
  remember: [
    "**Few settings → grid. Many settings → random.**",
    "Random: **MLP 16, forest 14, boosting 25.**"
  ],
  point: { cells: [26, 45], text: "The `if random_search:` line in tune(), and `random_search=True, n_iter=25` in the boosting search." },
  recall: [
    { q: "When did you use grid search?", a: "When there were few settings: tree, k-NN, logistic regression, SVM, bagging." },
    { q: "When did you use random search, and why?", a: "For the MLP, random forest and boosting, because they have many settings and random search covers them faster." },
    { q: "How many settings did boosting's random search try?", a: "25." }
  ]
},
{
  id: "gap", part: "D", title: "The overfitting gap",
  plain: [
    "The **overfitting gap** = training score minus validation score.",
    "A big gap means the model learned noise in the training data.",
    "A small gap means it does about as well on new data as on its own training data."
  ],
  project: [
    { table: { head: ["Model", "Training AUC", "CV AUC", "Gap"], rows: [
      ["Random forest", "0.8573", "0.8254", "**0.032**"],
      ["Bagging", "0.8487", "0.8239", "0.025"],
      ["Gradient boosting", "0.8416", "0.8293", "**0.012**"],
      ["Decision tree", "0.8249", "0.8158", "0.009"],
      ["MLP", "0.8345", "0.8270", "0.007"],
      ["Logistic regression", "0.8272", "0.8264", "**0.001**"]
    ] } },
    "k-NN, the SVM and soft voting have no training score in the table (cell 49).",
    "Boosting stayed small thanks to a low learning rate, big leaves and early stopping (report 4.1)."
  ],
  say: "I checked overfitting with the gap between training AUC and validation AUC. The random forest had the biggest gap, 0.032. Boosting stayed small at 0.012 thanks to a low learning rate, big leaves and early stopping.",
  remember: [
    "**Forest 0.032, boosting 0.012, logistic 0.001.**",
    "Gap = **train minus validation.**"
  ],
  point: { cells: [49], text: "The `gap` column of the CV results table." },
  recall: [
    { q: "How is the gap calculated?", a: "Training AUC minus validation AUC." },
    { q: "Which model overfit most?", a: "The random forest, gap 0.032." },
    { q: "Why was boosting's gap small?", a: "A low learning rate, big leaves and early stopping." }
  ]
},
{
  id: "bias-variance", part: "D", title: "Bias-variance and the depth curve",
  plain: [
    "**High bias**: the model is too simple and misses patterns.",
    "**High variance**: the model is too complex and memorises noise.",
    "The best setting sits between the two. This is the **bias-variance trade-off**.",
    "A **validation curve** plots training and validation scores as one setting changes."
  ],
  project: [
    "`validation_curve` over tree depths 2 to 25, with no limit on leaf size (cell 31).",
    "At depth 2, both scores are about 0.75: too simple (high bias).",
    "Validation AUC **peaks at depth 7 with 0.815**. Then it falls to **0.659 at depth 25**, while training AUC climbs to **1.0** (report 4.1).",
    "The grid search itself chose depth 8 with a minimum leaf of 200 (cell 30)."
  ],
  say: "For the decision tree I plotted a validation curve. Validation AUC peaks around depth 7 and then falls to 0.66 at depth 25 while training AUC goes to 1.0, which is the bias-variance trade-off.",
  remember: [
    "**Depth 2 too simple, depth 7 best, depth 25 memorises.**",
    "At depth 25: **train 1.0, validation 0.66.**"
  ],
  point: { cells: [31], text: "The 'Decision tree: depth vs AUC' plot: the training line rises, the validation line peaks then falls." },
  recall: [
    { q: "Where does validation AUC peak on the depth curve?", a: "Around depth 7, at 0.815." },
    { q: "What happens at depth 25?", a: "Training AUC goes to 1.0, validation falls to 0.66: high variance." },
    { q: "What does high bias look like on this curve?", a: "At depth 2, both scores are low, about 0.75." }
  ]
},
{
  id: "early-stopping", part: "D", title: "Early stopping (287 trees)",
  plain: [
    "**Early stopping** holds back a small part of the training data.",
    "Training stops when the score on that part stops improving.",
    "It prevents the model from adding steps that only learn noise."
  ],
  project: [
    "Boosting: `early_stopping=True, validation_fraction=0.1, n_iter_no_change=30`, with up to 1,000 trees (cell 45).",
    "So it holds back **10%** and stops when the score stops improving for **30 rounds**.",
    "It stopped at **287 trees** (report Table 2 and 5.3).",
    "The MLP also used early stopping, holding back 10% of each training fold (cell 37)."
  ],
  say: "Early stopping holds back 10% of the training data and stops adding trees when that score stops improving for 30 rounds. It stopped at 287 trees, which prevents overfitting.",
  remember: [
    "**10% held back, 30 rounds of patience, 287 trees.**"
  ],
  point: { cells: [45], text: "`early_stopping=True, validation_fraction=0.1, n_iter_no_change=30` in the boosting pipeline." },
  recall: [
    { q: "What share of data does early stopping hold back?", a: "10%." },
    { q: "When does it stop?", a: "When the held-back score stops improving for 30 rounds." },
    { q: "How many trees did boosting end with?", a: "287." }
  ]
},
{
  id: "svm-trap", part: "D", title: "The SVM sample trap (0.832 → 0.826)",
  plain: [
    "A score from a **small sample** can be noisy: it has a big spread.",
    "A noisy score can rank a model too high by luck.",
    "A fair comparison scores every model on the same data."
  ],
  project: [
    "The SVM search ran on **10,000 records** for speed (cell 40).",
    "On the sample it scored **0.8323**, but the SD was large: **0.0103** (cell 40).",
    "Re-scored on the full development set: **0.8256** (cell 41).",
    "If I had trusted the sample score, the SVM would have wrongly come first (report 4)."
  ],
  say: "For the SVM, the search ran on a 10,000-row sample for speed, but I re-scored the winner on the full data, because the sample score of 0.832 was noisy and would have wrongly ranked it first. On the full data it was 0.826.",
  remember: [
    "**Small sample, big spread: 0.832 ± 0.010 → 0.826.**"
  ],
  point: { cells: [41], text: "'SVM on the 10,000 sample: 0.8323' and 'SVM on the full development set: 0.8256'." },
  recall: [
    { q: "SVM score on the sample, and on the full data?", a: "0.832 on the sample, 0.826 on the full development set." },
    { q: "Why was the sample score not trusted?", a: "Its SD was large, 0.010, so it was too noisy to compare." },
    { q: "What would have happened if you trusted it?", a: "The SVM would have wrongly ranked first." }
  ]
},
{
  id: "folds", part: "D", title: "Why 5 folds and not 10",
  plain: [
    "More folds means each model trains on more data, but the run takes longer.",
    "The right number balances stable scores against run time."
  ],
  project: [
    "With 5 folds, each fold still trains on **about 40,700 rows**.",
    "The estimates are stable: SD about **0.003** (cell 49).",
    "10 folds would double the run time for little gain."
  ],
  say: "Five folds is a good balance. Each fold still trains on about 40,700 rows, so the estimates are stable, with an SD of about 0.003. Ten folds would double the run time for little gain.",
  remember: [
    "**5 folds: 40,700 rows each, SD 0.003, half the time of 10.**"
  ],
  point: { cells: [10, 49], text: "`StratifiedKFold(n_splits=5, ...)` in cell 10, and the `cv_sd` column in cell 49." },
  recall: [
    { q: "Why not 10 folds?", a: "It would double the run time for little gain." },
    { q: "How stable were the 5-fold scores?", a: "SD about 0.003." },
    { q: "How many rows does each fold train on?", a: "About 40,700." }
  ]
}
);

/* ================= E. EVALUATION ================= */
CONTENT.learn.push(
{
  id: "confusion", part: "E", title: "Confusion matrix (Week 8)",
  plain: [
    "A **confusion matrix** is a 2×2 table of truth vs prediction.",
    "**TP** (true positive): has it, flagged. **TN** (true negative): doesn't have it, not flagged.",
    "**FP** (false positive): doesn't have it, but flagged. A false alarm.",
    "**FN** (false negative): has it, but missed."
  ],
  project: [
    "Gradient boosting on the **12,725 test rows** at the **0.5 cut-off** (cell 59):",
    { table: { head: ["", "Predicted no", "Predicted yes"], rows: [
      ["**Actually no**", "TN 4,534", "FP 1,829"],
      ["**Actually yes**", "FN 1,287", "TP 5,075"]
    ] } }
  ],
  say: "At the 0.5 cut-off, the confusion matrix has 5,075 true positives and 4,534 true negatives. There are 1,287 missed cases and 1,829 false alarms. That gives recall 79.8% and specificity 71.3%.",
  remember: [
    "**Top row (no): 4,534 · 1,829. Bottom row (yes): 1,287 · 5,075.**",
    "Diagonal = right. Off-diagonal = wrong."
  ],
  point: { cells: [59], text: "The 'Confusion matrix: Gradient boosting' plot." },
  recall: [
    { q: "What is a false negative here?", a: "A person with diabetes the model missed. There were 1,287." },
    { q: "How many true positives?", a: "5,075." },
    { q: "How many false alarms (false positives)?", a: "1,829." }
  ]
},
{
  id: "acc-recall", part: "E", title: "Accuracy and recall",
  plain: [
    "**Accuracy** = (TP + TN) / everyone. The share of all predictions that are right.",
    "**Recall** (also **sensitivity** or **TPR**) = TP / (TP + FN). Of the people who have it, how many did we catch?"
  ],
  project: [
    "Accuracy = 9,609 / 12,725 = **75.5%**.",
    "Recall = 5,075 / 6,362 = **79.8%**. It catches 4 in 5 people with diabetes.",
    "Because the classes are balanced, accuracy is a fair measure here (report 1)."
  ],
  say: "Accuracy is 75.5% and recall is 79.8%, so it catches 4 in 5 people with diabetes. For screening, I'd lower the cut-off to 0.27, which catches 93.9% at the cost of more false alarms.",
  remember: [
    "**Accuracy 75.5, recall 79.8: '4 in 5 caught'.**"
  ],
  point: { cells: [54, 59], text: "The accuracy and recall columns in cell 54, and 'Sensitivity (recall): 0.7977' in cell 59." },
  recall: [
    { q: "What is the recall formula?", a: "TP / (TP + FN)." },
    { q: "What are accuracy and recall at 0.5?", a: "Accuracy 75.5%, recall 79.8%." },
    { q: "Why is accuracy fair here?", a: "The classes are exactly balanced." }
  ]
},
{
  id: "prec-spec-f1", part: "E", title: "Precision, specificity and F1",
  plain: [
    "**Precision** = TP / (TP + FP). Of the people we flagged, how many really have it?",
    "**Specificity** = TN / (TN + FP). Of the people without it, how many did we correctly clear?",
    "**FPR** (false positive rate) = 1 − specificity.",
    "**F1** = the harmonic mean of precision and recall. It is high only when both are high."
  ],
  project: [
    "Precision = 5,075 / 6,904 = **73.5%**.",
    "Specificity = 4,534 / 6,363 = **71.3%**. FPR = **28.7%**.",
    "F1 = **0.765** (cells 54 and 59)."
  ],
  say: "Precision is 73.5%: of the people the model flagged, 73.5% really have diabetes. Specificity is 71.3%, and F1 is 0.765.",
  remember: [
    "**Precision 73.5, specificity 71.3, F1 0.765.**",
    "**Recall asks the sick. Specificity asks the healthy. Precision asks the flagged.**"
  ],
  point: { cells: [54, 59], text: "Precision and F1 in the test table (cell 54), 'Specificity: 0.7126' in cell 59." },
  recall: [
    { q: "What is precision?", a: "TP / (TP + FP): of the people flagged, how many really have it." },
    { q: "What is specificity at 0.5?", a: "71.3%." },
    { q: "What is F1?", a: "The harmonic mean of precision and recall: 0.765." }
  ]
},
{
  id: "prec-vs-recall", part: "E", title: "Precision vs recall",
  plain: [
    "Lowering the cut-off flags more people. Recall goes up, precision goes down.",
    "Raising the cut-off flags fewer people. Precision goes up, recall goes down.",
    "Which matters more depends on the cost of each mistake."
  ],
  project: [
    "At 0.5: recall **79.8%**, precision **73.5%**.",
    "At 0.27: recall **93.9%**, precision **65.4%** (cell 63).",
    "In screening, missing a person with diabetes is usually worse than one extra blood test (report 5.4)."
  ],
  say: "For screening, a missed case costs more than an extra test, so recall matters more. Lowering the cut-off to 0.27 lifts recall from 79.8% to 93.9%, while precision falls from 73.5% to 65.4%.",
  remember: [
    "**Recall = don't miss. Precision = don't false-alarm.**",
    "**0.5: 79.8 / 73.5. 0.27: 93.9 / 65.4.**"
  ],
  point: { cells: [64], text: "The 'Cut-off trade-off' plot: recall falls and precision rises as the cut-off goes up." },
  recall: [
    { q: "What happens to recall and precision when you lower the cut-off?", a: "Recall goes up, precision goes down." },
    { q: "Recall and precision at 0.27?", a: "Recall 93.9%, precision 65.4%." },
    { q: "Why favour recall in screening?", a: "A missed case costs more than an extra test." }
  ]
},
{
  id: "roc-auc", part: "E", title: "ROC curve and AUC",
  plain: [
    "Move the cut-off from 1 down to 0. At every point, plot **TPR** (recall) against **FPR**. That is the **ROC curve**.",
    "**AUC** is the area under that curve.",
    "AUC is also the chance that a random person with the condition gets a higher score than a random person without.",
    "0.5 = guessing (the diagonal). 1.0 = perfect."
  ],
  project: [
    "Boosting's test AUC is **0.8346**, said as 0.835 (cell 54).",
    "The ROC curves of all models nearly sit on top of each other (cell 55).",
    "All of them are about 0.33 above random guessing (report 4.2)."
  ],
  say: "I chose AUC because this is a screening problem. AUC measures ranking across every cut-off, and the cut-off can be chosen later. My best model's test AUC is 0.835.",
  remember: [
    "**AUC = chance a sick person outranks a healthy one.**",
    "**0.5 guess, 0.835 mine, 1.0 perfect.**"
  ],
  point: { cells: [55], text: "The 'ROC curves on the test set' plot, with each AUC in the legend and the dashed random line." },
  recall: [
    { q: "What is plotted on a ROC curve?", a: "True positive rate against false positive rate, at every cut-off." },
    { q: "What does AUC mean as a chance?", a: "The chance a random person with diabetes scores higher than a random person without." },
    { q: "What is your test AUC?", a: "0.835." }
  ]
},
{
  id: "train-val-test", part: "E", title: "Train, validation and test",
  plain: [
    "**Training** data fits the model.",
    "**Validation** data (the CV folds) picks the settings.",
    "The **test** set is used once at the end for an honest score.",
    "Using the test set to pick settings would make its score too optimistic."
  ],
  project: [
    "Training and validation happened inside 5-fold CV on the **50,897** development rows.",
    "The **12,725** test rows were used once, in Section 6 (cell 54).",
    "Every tuned model was refit on all development rows, then scored once on the test set."
  ],
  say: "Training data fits the model, the validation folds pick the settings, and the test set is used once at the end for an honest score. I kept 20% aside from the start and scored every model on it once.",
  remember: [
    "**Train = learn. Validation = choose. Test = judge, once.**"
  ],
  point: { cells: [14, 54], text: "The split in cell 14, and the single test-set scoring in cell 54." },
  recall: [
    { q: "What is the validation data used for?", a: "Picking the settings." },
    { q: "Why use the test set only once?", a: "Using it to pick settings would make its score too optimistic." },
    { q: "How many rows were in the test set?", a: "12,725." }
  ]
},
{
  id: "bootstrap-ci", part: "E", title: "Bootstrap 95% confidence interval",
  plain: [
    "A **confidence interval (CI)** is a range that shows how much a score could move by chance.",
    "**Bootstrapping** builds many new samples by drawing rows with replacement, and scores each one.",
    "The middle 95% of those scores is the **95% CI**."
  ],
  project: [
    "**1,000 bootstrap samples** of the 12,725 test rows (cell 54).",
    "AUC on each sample. The 2.5th and 97.5th percentiles give the 95% CI.",
    "Boosting: **0.8346 (95% CI 0.828 to 0.841)**."
  ],
  say: "To know if differences were real, I used 1,000 bootstrap samples of the test set for 95% confidence intervals. Boosting's test AUC is 0.835, with a 95% interval from 0.828 to 0.841.",
  remember: [
    "**1,000 resamples, middle 95%: 0.828 to 0.841.**"
  ],
  point: { cells: [54], text: "`boot_samples` and the `auc_95_ci` column in the test table." },
  recall: [
    { q: "How many bootstrap samples?", a: "1,000 samples of the test set." },
    { q: "How is the 95% CI taken?", a: "The 2.5th and 97.5th percentiles of the 1,000 AUCs." },
    { q: "Boosting's test AUC and CI?", a: "0.835, with a 95% CI of 0.828 to 0.841." }
  ]
},
{
  id: "paired", part: "E", title: "Paired bootstrap: is the difference real?",
  plain: [
    "A **paired** test scores two models on the **same** resampled people each time, and records the difference.",
    "If the 95% interval of the difference includes 0, the two models are not really different."
  ],
  project: [
    "Boosting compared with every other model on the same 1,000 bootstrap samples (cell 57):",
    { table: { head: ["Compared with", "Difference", "95% interval", "Really different?"], rows: [
      ["Soft voting", "−0.0005", "−0.0014 to 0.0004", "No (tie)"],
      ["MLP", "0.0011", "−0.0004 to 0.0025", "No (tie)"],
      ["Logistic regression", "0.0023", "0.0007 to 0.0040", "Yes"],
      ["SVM", "0.0031", "0.0014 to 0.0047", "Yes"],
      ["Random forest", "0.0032", "0.0018 to 0.0046", "Yes"],
      ["Bagging", "0.0054", "0.0037 to 0.0069", "Yes"],
      ["k-NN", "0.0081", "0.0057 to 0.0104", "Yes"],
      ["Decision tree", "0.0127", "0.0102 to 0.0151", "Yes"]
    ] } }
  ],
  say: "A paired bootstrap compares two models on the same resampled people. Boosting versus soft voting includes zero, so it is a tie, and the MLP is also a tie. Boosting is significantly better than logistic regression, the SVM, the random forest, bagging, k-NN and the tree.",
  remember: [
    "**2 ties (voting, MLP), 6 wins.**",
    "Interval **includes 0 → tie.**"
  ],
  trap: "The guide's walkthrough line says 'It beats the other 6'. That is true, but say both ties: soft voting **and** the MLP.",
  point: { cells: [57], text: "The `really_different` column: False for soft voting and the MLP, True for the other 6." },
  recall: [
    { q: "What makes a paired test 'paired'?", a: "Both models are scored on the same resampled people each time." },
    { q: "Which models tie with boosting?", a: "Soft voting and the MLP." },
    { q: "When are two models 'not really different'?", a: "When the 95% interval of the difference includes 0." }
  ]
},
{
  id: "one-se", part: "E", title: "The one-standard-error rule: why boosting",
  plain: [
    "The **standard error (SE)** is how much an average could move by chance: SD / √(number of folds).",
    "The **one-standard-error rule**: any model within one SE of the top score counts as tied. Then pick the simplest.",
    "Setting the rule **before** seeing test results stops you choosing by luck."
  ],
  project: [
    "Rule set before looking at the test set (cell 51).",
    "SE = 0.0030 / √5 = **0.0013**. So the tie band is CV AUC **≥ 0.828** (cell 52).",
    "Tied: **gradient boosting (0.8293) and soft voting (0.8291)**.",
    "Chosen: **gradient boosting**, the simpler one. It is one model instead of three, trains in about 2 seconds, and is easier to explain (report 5.1)."
  ],
  say: "Soft voting actually scored 0.0005 higher on test, but a paired bootstrap shows the difference is not real. My rule, set before testing, was: anything within one standard error of the top CV score is a tie, and then choose the simplest. Boosting is one model instead of three.",
  remember: [
    "**0.0030 / √5 = 0.0013 → tie band 0.828.**",
    "**Tie → simplest → boosting.**"
  ],
  point: { cells: [52], text: "`standard_error = top['cv_sd'] / np.sqrt(5)` and the output 'Tied models: Gradient boosting, Soft voting'." },
  recall: [
    { q: "How is the standard error calculated?", a: "SD divided by the square root of the number of folds: 0.0030 / √5 = 0.0013." },
    { q: "Which models were tied by the rule?", a: "Gradient boosting and soft voting." },
    { q: "Why was the rule set before testing?", a: "So I couldn't cherry-pick a model from the test results." }
  ]
},
{
  id: "test-vs-cv", part: "E", title: "Why test AUC is above CV AUC, and why all models are close",
  plain: [
    "A model trained on more data is usually a little better.",
    "If very different models all score about the same, the limit is usually the data, not the method."
  ],
  project: [
    "Test AUCs are a little higher than CV, by about **0.005** (report 4.2).",
    "The final models trained on **50,897** rows, instead of about **40,718** per fold. It is not a sign of overfitting.",
    "The best and worst tuned models are only **0.013** AUC apart on test (0.8351 vs 0.8220)."
  ],
  say: "Test AUC is a little higher because the final models were trained on all 50,897 development rows instead of about 40,700 per fold. More data gives slightly better models, so it's not overfitting. All models are close because the limit is the information in 21 self-reported answers, not the algorithm.",
  remember: [
    "**More rows at the end → slightly higher test score.**",
    "**0.013 spread → the data is the limit.**"
  ],
  point: { cells: [54, 55], text: "Compare the test table (cell 54) with the CV table (cell 49), then the ROC curves almost on top of each other (cell 55)." },
  recall: [
    { q: "Why is test AUC higher than CV AUC?", a: "The final models were trained on all 50,897 development rows instead of about 40,700 per fold." },
    { q: "Is that overfitting?", a: "No. More data gives slightly better models." },
    { q: "Why are all the models so close?", a: "The limit is the information in 21 self-reported answers, not the algorithm." }
  ]
}
);

/* ================= F. INTERPRETING ================= */
CONTENT.learn.push(
{
  id: "permutation", part: "F", title: "Permutation importance: which features matter",
  plain: [
    "**Permutation importance** shuffles one column and measures how much the score drops.",
    "A big drop means the model relies on that feature.",
    "It works for any model."
  ],
  project: [
    "Each attribute shuffled 5 times on the test set; drop in test AUC (cell 61).",
    { table: { head: ["Feature", "Drop in AUC"], rows: [["GenHlth", "0.0575"], ["BMI", "0.0377"], ["Age", "0.0259"], ["HighBP", "0.0184"], ["HighChol", "0.0112"], ["CholCheck", "0.0039"]] } },
    "Fruit, vegetable and exercise flags add almost nothing once these are known (report 5.3).",
    "This matches what we know about type 2 diabetes, so the model learned real patterns, not noise."
  ],
  say: "GenHlth, BMI, Age, HighBP and HighChol drive the model. GenHlth matters most, with a drop of 0.057. They match the known risk factors for type 2 diabetes, which suggests the model learned real patterns.",
  remember: [
    "**G-B-A-B-C: GenHlth, BMI, Age, BP, Chol.**",
    "**0.057, 0.038, 0.026, 0.018, 0.011.**"
  ],
  point: { cells: [61], text: "The 'Permutation importance: Gradient boosting' bar chart and the top-6 list." },
  recall: [
    { q: "How does permutation importance work?", a: "Shuffle one column and measure the drop in AUC." },
    { q: "Name the top 5 features.", a: "GenHlth, BMI, Age, HighBP, HighChol." },
    { q: "Why does the ranking reassure you?", a: "It matches known type 2 diabetes risk factors, so the model learned real patterns." }
  ]
},
{
  id: "cutoff", part: "F", title: "The 0.27 screening cut-off",
  plain: [
    "A model gives a probability. The **cut-off** turns it into yes or no.",
    "A lower cut-off flags more people: more cases caught, more false alarms.",
    "**Out-of-fold** predictions come from models that never saw those rows, so they are honest."
  ],
  project: [
    "Chosen on **development-set predictions only** (`cross_val_predict`), not the test set (cell 63).",
    "Rule: the **lowest cut-off that keeps precision at 0.65 or above**. That gave **0.273**, said as 0.27.",
    "Precision 0.65 means about two real cases for every three people flagged (report 5.4).",
    { table: { head: ["Cut-off", "Recall", "Precision", "Accuracy"], rows: [["0.27", "93.9%", "65.4%", "72.1%"], ["0.5", "79.8%", "73.5%", "75.5%"]] } },
    "If the goal is just the highest accuracy, 0.5 is still right. It is a business decision (report 5.4)."
  ],
  say: "I chose a screening cut-off of 0.27 using only development-set predictions. It lifts recall from 79.8% to 93.9%, while precision falls to 65.4%. I didn't use the test set, because then its score would no longer be honest.",
  remember: [
    "**0.27 → 93.9 / 65.4 / 72.1.**",
    "If they ask 'why not choose it on the test set?', I say: 'Then the test score would no longer be honest.'"
  ],
  point: { cells: [63, 64], text: "'Chosen cut-off: 0.273' and the two printed lines in cell 63, then the cut-off plot in cell 64." },
  recall: [
    { q: "What was the cut-off rule?", a: "The lowest cut-off that keeps precision at 0.65 or above." },
    { q: "What does 0.27 give on the test set?", a: "Recall 93.9%, precision 65.4%, accuracy 72.1%." },
    { q: "Which data was used to choose it?", a: "Out-of-fold predictions on the development set only." }
  ]
},
{
  id: "refit", part: "F", title: "Final refit on all 63,622 rows",
  plain: [
    "Once the model and its settings are fixed, you can train it one last time on all the labelled data.",
    "The earlier test score stays the honest estimate."
  ],
  project: [
    "`final_models[chosen].fit(X, y)` trains gradient boosting on **all 63,622 records** (cell 66).",
    "Expected AUC on new people, from the test set: **0.8346** (cell 66 output)."
  ],
  say: "Finally I refit gradient boosting on all 63,622 rows for deployment, so it learns from as much data as possible. The test score of 0.835 stays the honest estimate.",
  remember: [
    "**Fix the settings, then use every row.**"
  ],
  point: { cells: [66], text: "`.fit(X, y)` and 'Expected AUC on new people (from the test set): 0.8346'." },
  recall: [
    { q: "How many rows does the final model train on?", a: "All 63,622." },
    { q: "Which score is the honest estimate?", a: "The test AUC, 0.835." },
    { q: "Why refit at all?", a: "So the final model learns from as much data as possible." }
  ]
},
{
  id: "limits", part: "F", title: "Limits: causes, calibration, the ceiling",
  plain: [
    "**Cross-sectional** data is measured at one point in time, so it cannot show cause and effect.",
    "**Calibration** means making predicted probabilities match real-world rates.",
    "**Nested cross-validation** puts one CV loop inside another, so choosing settings never touches the scoring folds."
  ],
  project: [
    "The probabilities assume a **50%** diabetes rate. They need adjusting to about **14%** before real use (report 5.5).",
    "The data is self-reported and from one point in time. Some predictors, like HighBP and DiffWalk, may be results of diabetes, not causes.",
    "An AUC of about **0.83** seems close to the limit for this data. Doing much better needs new information, such as family history, waist size or blood tests.",
    "With more time: nested cross-validation, probability calibration, a time budget per model, and saving progress from day one (report 6)."
  ],
  say: "The model can find who has diabetes, but it cannot say what causes it, because the data is cross-sectional and self-reported. It would rank people well on the real population, but the probabilities assume 50% prevalence and would need recalibrating to about 14%.",
  remember: [
    "**Ranks yes, causes no, recalibrate 50 → 14.**",
    "More time: **nested CV, calibration, time budget, save from day one.**"
  ],
  point: { cells: [], text: "No notebook cell. These come from report sections 5.5 and 6." },
  recall: [
    { q: "Can the model say what causes diabetes?", a: "No. The data is cross-sectional and self-reported, and some predictors may be results of diabetes." },
    { q: "Would it work on the real population?", a: "It would rank people well, but the probabilities would need recalibrating from 50% to about 14%." },
    { q: "What would you do with more time?", a: "Nested cross-validation, probability calibration, a time budget per model, and saving progress from day one." }
  ]
}
);

/* ================= G. AT2 PREPROCESSING ================= */
CONTENT.learn.push(
{
  id: "at2-types", part: "G", title: "AT2: attribute types",
  plain: [
    "**Nominal**: labels with no order (like yes/no).",
    "**Ordinal**: ordered categories, but the gaps are not equal (like poor, fair, good).",
    "**Interval**: equal gaps but no true zero (like temperature in °C).",
    "**Ratio**: equal gaps and a true zero, so ratios make sense (like weight)."
  ],
  project: [
    "AT2 used my **3,000-row extract**, so its numbers differ from AT3.",
    "**Ratio:** BMI, MentHlth, PhysHlth. **Ordinal:** GenHlth, Age, Education, Income. **Nominal:** 14 binary flags + Sex.",
    "There are no interval attributes in this data (AT2 report 2.1).",
    "**Link to AT3:** the ordinal codes were one-hot encoded for linear models."
  ],
  say: "In AT2 I typed every attribute. BMI, MentHlth and PhysHlth are ratio. GenHlth, Age, Education and Income are ordinal. The 14 binary flags and Sex are nominal. That is why, in AT3, I one-hot encoded the ordinal codes for linear models.",
  remember: [
    "**NOIR: Nominal, Ordinal, Interval, Ratio.**",
    "Ratio = **BMI + the two Hlth day counts.**"
  ],
  point: { cells: [], text: "No AT3 cell. AT2 report section 2.1, Table 1." },
  recall: [
    { q: "Which attributes are ratio?", a: "BMI, MentHlth and PhysHlth." },
    { q: "Which are ordinal?", a: "GenHlth, Age, Education and Income." },
    { q: "How did this shape AT3?", a: "The ordinal codes were one-hot encoded for linear models." }
  ]
},
{
  id: "at2-binning", part: "G", title: "AT2: binning and smoothing",
  plain: [
    "**Binning** groups values into intervals but keeps them as numbers.",
    "**Equi-width**: equal-size intervals, width = (max − min) / number of bins.",
    "**Equi-depth**: bins with about equal counts. Identical values must stay in the same bin.",
    "**Smoothing** replaces each value with its bin mean, or with the nearest bin boundary."
  ],
  project: [
    "**Equi-width:** MentHlth and PhysHlth into 4 bins of 7.5 days. Very uneven: **84%** of MentHlth values in bin 1.",
    "**Equi-depth:** for MentHlth, bin 1 = all the zeros (**2,018**, 67.3%). The other bins hold **309, 313 and 360**.",
    "**Smoothing:** bin mean **lowered** variance. Bin boundary **raised** it.",
    "Recommended: **equi-depth + bin mean**, or a three-level code: none (0 days), intermittent (1–14), persistent (15–30).",
    "**Link to AT3:** not used directly. The FreqDistress flags (≥ 14 days) do a similar job."
  ],
  say: "Equi-depth bins could not be equal because 67% of MentHlth values are 0, and identical values must stay in the same bin, so the first bin is forced to be large. Bin-mean smoothing lowered the variance, and I recommended equi-depth with bin means.",
  remember: [
    "**Width: equal ranges. Depth: equal counts.**",
    "**Mean smooths down, boundary spreads out.**"
  ],
  point: { cells: [], text: "No AT3 cell. AT2 report section 4.1, Tables 4 to 6." },
  recall: [
    { q: "Why can't equi-depth bins be equal for MentHlth?", a: "67% of values are 0, and identical values must stay in the same bin." },
    { q: "Which smoothing lowered variance?", a: "Bin-mean smoothing. Bin-boundary smoothing raised it." },
    { q: "What share of MentHlth fell in equi-width bin 1?", a: "84%." }
  ]
},
{
  id: "at2-normalise", part: "G", title: "AT2: normalisation (min-max, z-score, decimal scaling)",
  plain: [
    "**Min-max**: (v − min) / (max − min), giving 0 to 1.",
    "**Z-score**: (v − mean) / SD, giving mean 0 and SD 1.",
    "**Decimal scaling**: divide by a power of 10. Simple, but it does not centre the data."
  ],
  project: [
    "**Min-max:** BMI min 14, max 92. About half of the values fall below 0.20 (median 0.192). One new extreme value would change everyone's scale.",
    "**Z-score:** mean **30.04**, SD **7.34**. **39 records** beyond |z| = 3. Extreme values stay visible.",
    "**Decimal scaling:** BMI / 100 gives 0.14 to 0.92.",
    "**Link to AT3:** z-score was used (StandardScaler). Min-max was rejected because of the long BMI tail."
  ],
  say: "I rejected min-max for BMI because the maximum of 92 sets the scale, so most people are squashed into a narrow range, and one new extreme value would change everyone's scale. Z-score keeps the spread meaningful, so I used it in AT3.",
  remember: [
    "**Min-max: max 92 rules. Z-score: 30.04 and 7.34 rule.**",
    "**Decimal: divide by 100, no centring.**"
  ],
  trap: "Say 'about half below 0.20', not 'most'. The AT2 notebook gives a min-max median of 0.192.",
  point: { cells: [], text: "No AT3 cell. AT2 report section 4.2, Table 7." },
  recall: [
    { q: "Why not min-max for BMI?", a: "The maximum of 92 sets the scale, squashing most values, and one new extreme changes everyone's scale." },
    { q: "Z-score mean and SD for BMI in AT2?", a: "Mean 30.04, SD 7.34." },
    { q: "What is the weakness of decimal scaling?", a: "It does not centre the data." }
  ]
},
{
  id: "at2-discretise", part: "G", title: "AT2: discretisation and binarisation",
  plain: [
    "**Discretisation** turns a number into categories (labels).",
    "**Binning** groups values but keeps them as numbers. Discretisation turns them into labels.",
    "**Binarisation** turns a category into 0/1 columns."
  ],
  project: [
    "**Age** codes grouped into **5 life stages**. The boundaries fit the 5-year codes exactly, so no records are split.",
    "Diabetes rate rose across the stages, from **4.65%** to **62.34%**.",
    "**Sex:** one indicator, male = 1. Two one-hot columns would be redundant, since they are exact opposites.",
    "**Link to AT3:** AT3 discretised BMI into WHO bands (BMI_cat), and binarised Sex the same way."
  ],
  say: "In AT2 I discretised Age codes into 5 life stages, with boundaries that fit the 5-year codes exactly. I binarised Sex into one indicator, male = 1, because two columns would be redundant. AT3 did the same with Sex, and used WHO bands for BMI.",
  remember: [
    "**Binning keeps numbers. Discretisation makes labels.**",
    "**Age → 5 stages. Sex → 1 column.**"
  ],
  point: { cells: [12, 16], text: "In AT3: the Sex line in cell 12 and BMI_cat in cell 16." },
  recall: [
    { q: "Binning vs discretisation?", a: "Binning groups values but keeps them as numbers. Discretisation turns them into categories." },
    { q: "How many age stages in AT2?", a: "5." },
    { q: "Why one column for Sex?", a: "Two one-hot columns are exact opposites, so one is redundant." }
  ]
},
{
  id: "at2-correlation", part: "G", title: "AT2: correlation and interaction",
  plain: [
    "**Pearson** correlation measures straight-line relationships between numbers.",
    "**Spearman** correlation uses ranks, so it suits ordered or binary data.",
    "**Chi-square** tests whether two categories are linked. **Cramér's V** gives the strength, from 0 to 1."
  ],
  project: [
    "Spearman was used because most attributes are ordinal or binary, not normal.",
    "Strongest by Cramér's V: **GenHlth 0.43, HighBP 0.38, BMI 0.36** (exact: 0.432, 0.382, 0.364).",
    "Interaction: **HighBP + HighChol** gave **74.5%** diabetes, vs **22.6%** with neither.",
    "A count of 6 clinical risk factors rose from 17.1% diabetes with none to 83.8% with four.",
    "**Link to AT3:** the same top features as AT3's permutation importance. BP × Chol became **BP_Chol**. The risk-count idea became **CardioCount** (4 flags in AT3)."
  ],
  say: "I used Spearman, not Pearson, because most attributes are ordinal or binary, so a rank-based correlation fits better. The strongest links were GenHlth, HighBP and BMI. HighBP with HighChol gave 74.5% diabetes against 22.6% with neither, which became my BP_Chol feature.",
  remember: [
    "**Pearson = straight line. Spearman = ranks.**",
    "**V: 0.43, 0.38, 0.36. Both conditions: 74.5 vs 22.6.**"
  ],
  trap: "AT2's risk count used 6 factors (including Smoker and DiffWalk). AT3's CardioCount uses 4: HighBP, HighChol, HeartDiseaseorAttack, Stroke.",
  point: { cells: [16], text: "In AT3: BP_Chol and CardioCount in add_features (cell 16)." },
  recall: [
    { q: "Why Spearman, not Pearson?", a: "Most attributes are ordinal or binary, not normal, so a rank-based correlation fits better." },
    { q: "Top 3 by Cramér's V?", a: "GenHlth 0.43, HighBP 0.38, BMI 0.36." },
    { q: "Which AT3 feature came from the BP × Chol finding?", a: "BP_Chol." }
  ]
},
{
  id: "at2-clusters", part: "G", title: "AT2: clustering",
  plain: [
    "**Clustering** groups similar records without using the target.",
    "**k-means** splits data into k groups around centre points.",
    "The **elbow** method picks k where adding more groups stops helping much.",
    "**PCA** squeezes many columns into 2 so the groups can be plotted."
  ],
  project: [
    "k-means on standardised attributes, PCA to plot. **k = 4** by the elbow.",
    "A **'healthy-looking but high-risk' cluster**: 1,107 records (37%), older, 92% with high blood pressure, but good self-rated health. Diabetes rate **63%**.",
    "The PCA plot showed strong overlap between the classes.",
    "**Link to AT3:** the classes overlap, which explains the AUC ceiling of about 0.83."
  ],
  say: "In AT2, k-means with k = 4 found a healthy-looking but high-risk cluster with 63% diabetes. The classes overlapped strongly, which explains why every AT3 model hit a ceiling of about 0.83 AUC.",
  remember: [
    "**k = 4, one hidden-risk cluster at 63%.**",
    "**Overlap → ceiling about 0.83.**"
  ],
  point: { cells: [], text: "No AT3 cell. AT2 report section 3.3, Table 3." },
  recall: [
    { q: "How was k chosen?", a: "By the elbow method: k = 4." },
    { q: "What was special about one cluster?", a: "It looked healthy but had 63% diabetes." },
    { q: "How does clustering link to AT3's results?", a: "The classes overlap, which explains the AUC ceiling of about 0.83." }
  ]
},
{
  id: "at2-outliers", part: "G", title: "AT2: outliers",
  plain: [
    "The **IQR** (interquartile range) is the spread of the middle half of the data.",
    "The **1.5 × IQR rule** flags values far above the upper quartile.",
    "The **3-SD rule** flags values more than 3 standard deviations from the mean."
  ],
  project: [
    "BMI was the only attribute with clear outliers.",
    "1.5 × IQR gave an upper limit of 45 and flagged **96 records**. The 3-SD rule flagged **39**.",
    "They were **kept**, because they are real: a BMI of 92 is extreme but possible, and these people had a higher diabetes rate (72.9%).",
    "**Link to AT3:** kept again in AT3, but capped at 60."
  ],
  say: "In AT2, 96 BMI records were above 45 by the IQR rule. I kept them because they are real high-risk people. In AT3 I kept them again but capped BMI at 60.",
  remember: [
    "**96 by IQR, 39 by 3-SD, all kept.**",
    "**AT2 keep → AT3 keep + cap.**"
  ],
  point: { cells: [16], text: "In AT3: `BMI_clip = BMI.clip(upper=60)` in cell 16." },
  recall: [
    { q: "How many BMI outliers by the IQR rule?", a: "96 records above 45." },
    { q: "Why keep them?", a: "They are real, possible values and high-risk people." },
    { q: "What changed in AT3?", a: "They were kept but BMI was capped at 60." }
  ]
},
{
  id: "at2-to-at3", part: "G", title: "How AT2 shaped AT3",
  plain: [
    "Exploring data first shows which cleaning steps and features are worth building."
  ],
  project: [
    { list: [
      "**Drop pid:** treated as an ID only in AT2. In AT3, the leak was proven and pid was dropped.",
      "**Binarise Sex:** one indicator, male = 1, in both.",
      "**Z-score scaling:** chosen over min-max in AT2, used as StandardScaler in AT3.",
      "**Interactions:** BP × Chol became BP_Chol. The risk-count idea became CardioCount."
    ] },
    "One AT2 idea did **not** carry over well: filtering out weak features. In AT3, the filter removed HvyAlcoholConsump and made boosting worse (F3)."
  ],
  say: "Four direct links: drop pid, binarise Sex, z-score scaling, and the BP times Chol and risk-count interactions became new features.",
  remember: [
    "**P-S-Z-I: Pid, Sex, Z-score, Interactions.**"
  ],
  point: { cells: [12, 16, 19], text: "Cell 12 (drop pid, Sex), cell 16 (BP_Chol, CardioCount), cell 19 (StandardScaler)." },
  recall: [
    { q: "Name the four links from AT2 to AT3.", a: "Drop pid, binarise Sex, z-score scaling, and interactions becoming new features." },
    { q: "Which AT2 idea did not work in AT3?", a: "Filtering out weak features: it removed HvyAlcoholConsump and hurt boosting." },
    { q: "Which two AT3 features came from AT2 interactions?", a: "BP_Chol and CardioCount." }
  ]
}
);

/* ================= H. HONEST ANSWERS ================= */
CONTENT.learn.push(
{
  id: "ai-tools", part: "H", title: "The AI-tools question",
  plain: [
    "An honest answer that matches your declaration is always safer than a polished one.",
    "The best proof that you understand code is explaining any line on request."
  ],
  project: [
    "Answer honestly and **match exactly what you declared**. The files do not say what you declared, so check your own submission.",
    "The report says I rewrote my first version in a simpler way that I can walk through in the oral defence (report 6)."
  ],
  say: "Yes, I used AI to help structure and simplify the code and the report. I ran every cell myself, checked the outputs, and I can explain every line.",
  remember: [
    "**Honest, matching, then prove it on any cell.**"
  ],
  trap: "The 'Say it' text is the guide's example. Change it to match exactly what you declared.",
  point: { cells: [], text: "Any cell they point at. Explain it line by line (Code walkthrough, 'Line by line')." },
  recall: [
    { q: "What must your AI answer match?", a: "Exactly what you declared." },
    { q: "How do you prove you understand the code?", a: "By explaining any cell they point at." },
    { q: "Say the guide's example answer.", a: "Yes, I used AI to help structure and simplify the code and the report. I ran every cell myself, checked the outputs, and I can explain every line." }
  ]
},
{
  id: "saved-results", part: "H", title: "Why the notebook loads saved results",
  plain: [
    "A **checkpoint** saves a finished step so it can be reloaded instead of re-run.",
    "Reloading a saved result gives exactly the same numbers as running it again."
  ],
  project: [
    "`checkpoint(name, make)` loads a saved result if it exists. Otherwise it runs `make()`, saves the result, and returns it (cell 4).",
    "Files are saved in the Google Drive folder.",
    "My Colab session kept disconnecting during the 30-minute run, so I added saving after every step (report 6)."
  ],
  say: "Colab disconnected during the 30-minute run, so each step saves to Drive. The code is exactly the same, and deleting the saved files reruns everything from scratch.",
  remember: [
    "**Saved, not changed. Delete the files to rerun.**"
  ],
  trap: "In your attached notebook, cells 44 and 45 show 'search took 713 s' and 'search took 450 s', so those steps ran live. Run the notebook once before the exam, so every step loads quickly.",
  point: { cells: [4], text: "The `checkpoint(name, make)` function." },
  recall: [
    { q: "Why does the notebook load saved results?", a: "Colab disconnected during the 30-minute run, so each step saves to Drive." },
    { q: "Does loading change any result?", a: "No. The code is exactly the same." },
    { q: "How would you rerun everything from scratch?", a: "Delete the saved files." }
  ]
}
);

/* ================= NUMBER STORY ================= */
CONTENT.learn.push(
{
  id: "number-story", part: "S", title: "Number story: every key number in story order",
  plain: [
    "**Chunking** means grouping numbers into small sets of 2 or 3, which are easier to remember.",
    "A **story chain** puts numbers in the order you will say them."
  ],
  project: [
    "Story order: **data → split → features → tuning → results → cut-off.**",
    { table: { head: ["Step", "Chunks"], rows: [
      ["1. Data", "**63,622** rows · **23** columns (pid + target + **21**) · **31,811** each = 50/50 · real about **14%**"],
      ["   Checks", "**1,365** duplicates (2.1%) kept · pid one split = AUC **1.000** · **231** BMI above 60, capped"],
      ["2. Split", "**50,897** dev (80%) · **12,725** test (20%) · seed **42** · 5 folds of about **40,718 / 10,179**"],
      ["3. Features", "**9** new features · **4** feature sets (F0 to F3) · linear **F2**, trees and k-NN **F1**"],
      ["4. Tuning", "Boosting: lr **0.033** · **23** leaves · leaf **290** · L2 **0.13** · **43%** features · **287** trees"],
      ["   Traps", "SVM **0.832** (SD 0.010) on sample → **0.826** full"],
      ["5. Results", "Boosting CV **0.829** (0.8293 ± 0.0030) · test **0.835** (CI 0.828 to 0.841)"],
      ["   Test metrics", "Accuracy **75.5%** · precision **73.5%** · recall **79.8%** · specificity **71.3%** · F1 **0.765**"],
      ["   Runner-up", "Voting CV **0.8291** · test **0.8351** · tied"],
      ["   Worst, spread", "Tree CV **0.816**, test **0.822** · all within **0.013**"],
      ["   Rule", "SE = 0.0030 / √5 = **0.0013** → tie band **≥ 0.828**"],
      ["   Matrix", "TN **4,534** · FP **1,829** · FN **1,287** · TP **5,075**"],
      ["   Features", "GenHlth **0.057** · BMI **0.038** · Age **0.026** · HighBP **0.018** · HighChol **0.011**"],
      ["6. Cut-off", "**0.27** → recall **93.9%**, precision **65.4%**, accuracy **72.1%** (vs 0.5: recall 79.8%)"]
    ] } }
  ],
  say: "My task was to predict Diabetes_binary from 21 BRFSS survey answers. Gradient boosting was best, with CV AUC 0.829 and test AUC 0.835. A screening cut-off of 0.27 lifts recall from 79.8% to 93.9%.",
  remember: [
    "**Big three: 0.829 · 0.835 · 0.27.**",
    "**Recall pair: 79.8 → 93.9.**",
    "**Split pair: 50,897 / 12,725.**"
  ],
  point: { cells: [14, 21, 49, 54, 63], text: "The split (14), feature sets (21), CV table (49), test table (54), cut-off (63)." },
  recall: [
    { q: "Say the split numbers.", a: "Development 50,897 (80%), test 12,725 (20%), seed 42." },
    { q: "Say boosting's CV and test AUC with the CI.", a: "CV 0.829, test 0.835, 95% CI 0.828 to 0.841." },
    { q: "Say the 0.27 cut-off numbers.", a: "Recall 93.9%, precision 65.4%, accuracy 72.1%." }
  ]
}
);

/* ================= GLOSSARY ================= */
CONTENT.glossary = [
  { id: "g-accuracy", term: "Accuracy", plain: "The share of all predictions that are right: (TP + TN) / everyone.", lesson: "acc-recall" },
  { id: "g-activation", term: "Activation", plain: "The bend each neuron in a neural network adds, such as relu or tanh.", lesson: "mlp" },
  { id: "g-alpha", term: "alpha", plain: "In the MLP, a penalty that keeps weights small (L2).", lesson: "mlp" },
  { id: "g-attribute", term: "Attribute", plain: "An input column, also called a feature.", lesson: "task" },
  { id: "g-auc", term: "AUC (ROC AUC)", plain: "A score for how well a model ranks people across every cut-off. 0.5 is guessing, 1.0 is perfect.", lesson: "roc-auc" },
  { id: "g-bagging", term: "Bagging", plain: "Many trees trained side by side on bootstrap samples, then averaged. It lowers variance.", lesson: "bagging" },
  { id: "g-balanced", term: "Balanced classes", plain: "Each class appears equally often.", lesson: "data" },
  { id: "g-baseline", term: "Baseline", plain: "The simplest possible model. Any real model should beat it.", lesson: "baseline" },
  { id: "g-bias", term: "Bias", plain: "Error from a model being too simple, so it misses patterns.", lesson: "bias-variance" },
  { id: "g-bv", term: "Bias-variance trade-off", plain: "Too simple misses patterns. Too complex memorises noise. The best setting sits between.", lesson: "bias-variance" },
  { id: "g-binarisation", term: "Binarisation", plain: "Turning a category into 0/1 columns.", lesson: "cleaning" },
  { id: "g-binary", term: "Binary classification", plain: "Predicting one of two classes, such as 1 or 0.", lesson: "problem-type" },
  { id: "g-binning", term: "Binning", plain: "Grouping values into intervals while keeping them as numbers.", lesson: "at2-binning" },
  { id: "g-boosting", term: "Boosting (gradient boosting)", plain: "Small trees added one after another, each fixing the errors left so far. It lowers bias.", lesson: "boosting" },
  { id: "g-bootstrap", term: "Bootstrap sample", plain: "Rows drawn at random with replacement, so some repeat and some are left out.", lesson: "bagging" },
  { id: "g-brfss", term: "BRFSS", plain: "Behavioral Risk Factor Surveillance System: the health survey the data comes from.", lesson: "task" },
  { id: "g-c", term: "C (regularisation setting)", plain: "In logistic regression and SVM, small C means stronger regularisation.", lesson: "logreg" },
  { id: "g-calibration", term: "Calibration", plain: "Adjusting predicted probabilities so they match real-world rates.", lesson: "limits" },
  { id: "g-checkpoint", term: "Checkpoint", plain: "A saved finished step that can be reloaded instead of re-run.", lesson: "saved-results" },
  { id: "g-chisq", term: "Chi-square test", plain: "A test of whether two categories are linked.", lesson: "at2-correlation" },
  { id: "g-ci", term: "Confidence interval (95% CI)", plain: "A range showing how much a score could move by chance.", lesson: "bootstrap-ci" },
  { id: "g-class", term: "Class", plain: "One of the possible answers, here 1 or 0.", lesson: "problem-type" },
  { id: "g-clustering", term: "Clustering", plain: "Grouping similar records without using the target.", lesson: "at2-clusters" },
  { id: "g-cm", term: "Confusion matrix", plain: "A 2×2 table of truth vs prediction: TP, TN, FP, FN.", lesson: "confusion" },
  { id: "g-conditional", term: "Conditional relevance", plain: "A feature that looks useless alone but matters once other features are known.", lesson: "f3-trap" },
  { id: "g-cramer", term: "Cramér's V", plain: "The strength of a link between two categories, from 0 to 1.", lesson: "at2-correlation" },
  { id: "g-cv", term: "Cross-validation (CV)", plain: "Split data into folds, train on all but one, check on the one left out, rotate and average.", lesson: "cv" },
  { id: "g-cutoff", term: "Cut-off (threshold)", plain: "The score above which a person is predicted 'yes'.", lesson: "cutoff" },
  { id: "g-decimal", term: "Decimal scaling", plain: "Dividing values by a power of 10. Simple, but it does not centre the data.", lesson: "at2-normalise" },
  { id: "g-tree", term: "Decision tree", plain: "A model that asks yes/no questions one after another.", lesson: "tree" },
  { id: "g-dev", term: "Development set", plain: "All data except the test set, used to build and tune models.", lesson: "split" },
  { id: "g-discretisation", term: "Discretisation", plain: "Turning a number into categories (labels).", lesson: "at2-discretise" },
  { id: "g-distance", term: "Distance (Euclidean, Manhattan)", plain: "How different two records are. Euclidean is the straight line. Manhattan adds the differences step by step.", lesson: "knn" },
  { id: "g-duplicates", term: "Duplicates", plain: "Rows with exactly the same values.", lesson: "data" },
  { id: "g-early", term: "Early stopping", plain: "Stop training when a held-back part of the data stops improving.", lesson: "early-stopping" },
  { id: "g-elbow", term: "Elbow method", plain: "Pick the number of clusters where adding more stops helping much.", lesson: "at2-clusters" },
  { id: "g-ensemble", term: "Ensemble", plain: "A model made of many models.", lesson: "bagging" },
  { id: "g-entropy", term: "Entropy / information gain", plain: "A measure of how mixed a group is. A tree picks splits that reduce it most.", lesson: "tree" },
  { id: "g-equidepth", term: "Equi-depth binning", plain: "Bins with about equal counts. Identical values stay in the same bin.", lesson: "at2-binning" },
  { id: "g-equiwidth", term: "Equi-width binning", plain: "Bins of equal size: (max − min) / number of bins.", lesson: "at2-binning" },
  { id: "g-f1", term: "F1", plain: "The harmonic mean of precision and recall. High only when both are high.", lesson: "prec-spec-f1" },
  { id: "g-feature", term: "Feature", plain: "An input the model looks at, also called an attribute.", lesson: "task" },
  { id: "g-fe", term: "Feature engineering", plain: "Making new inputs from existing ones.", lesson: "features" },
  { id: "g-fs", term: "Feature set", plain: "One chosen list of inputs to train on.", lesson: "feature-sets" },
  { id: "g-filter", term: "Filter method", plain: "Choosing features by scoring each one alone, before any model.", lesson: "mutual-info" },
  { id: "g-fit", term: "Fit", plain: "Learn a step's numbers (like a mean) or a model's weights from data.", lesson: "pipelines" },
  { id: "g-fold", term: "Fold", plain: "One of the equal parts data is split into for cross-validation.", lesson: "cv" },
  { id: "g-fpr", term: "False positive rate (FPR)", plain: "The share of people without the condition who are wrongly flagged: 1 − specificity.", lesson: "prec-spec-f1" },
  { id: "g-gap", term: "Overfitting gap", plain: "Training score minus validation score. A big gap means overfitting.", lesson: "gap" },
  { id: "g-gini", term: "Gini", plain: "A measure of how mixed a group is, used by trees to pick splits.", lesson: "tree" },
  { id: "g-grid", term: "Grid search", plain: "Trying every combination of the listed settings.", lesson: "grid-random" },
  { id: "g-hyper", term: "Hyper-parameter", plain: "A setting chosen before training, like tree depth.", lesson: "tune-fn" },
  { id: "g-interaction", term: "Interaction", plain: "Two features that matter more together than apart.", lesson: "features" },
  { id: "g-iqr", term: "IQR (interquartile range)", plain: "The spread of the middle half of the data.", lesson: "at2-outliers" },
  { id: "g-kernel", term: "Kernel", plain: "In an SVM, what lets the boundary bend. Linear is straight, RBF is curved.", lesson: "svm" },
  { id: "g-kmeans", term: "k-means", plain: "Clustering that splits data into k groups around centre points.", lesson: "at2-clusters" },
  { id: "g-knn", term: "k-NN (k-nearest neighbours)", plain: "Find the k most similar records and take their majority.", lesson: "knn" },
  { id: "g-l1l2", term: "L1 / L2 penalty", plain: "Ways to keep weights small. L1 can set weights to zero. L2 shrinks all weights.", lesson: "logreg" },
  { id: "g-leaf", term: "Leaf", plain: "A final group at the end of a tree's branches.", lesson: "tree" },
  { id: "g-leakage", term: "Data leakage", plain: "Information from outside the training data getting into the model.", lesson: "pipelines" },
  { id: "g-lr", term: "Learning rate", plain: "The size of each correction step. Smaller is more careful.", lesson: "boosting" },
  { id: "g-linear", term: "Linear model", plain: "A model whose boundary between classes is a straight line.", lesson: "logreg" },
  { id: "g-logreg", term: "Logistic regression", plain: "A weighted sum of inputs passed through a sigmoid to give a probability.", lesson: "logreg" },
  { id: "g-margin", term: "Margin", plain: "In an SVM, the gap between the boundary and the nearest records.", lesson: "svm" },
  { id: "g-maxdepth", term: "max_depth", plain: "How many questions a tree may ask in a row.", lesson: "tree" },
  { id: "g-minleaf", term: "min_samples_leaf", plain: "The fewest records allowed in a tree's final group.", lesson: "tree" },
  { id: "g-minmax", term: "Min-max normalisation", plain: "(value − min) / (max − min), giving 0 to 1.", lesson: "scaling" },
  { id: "g-mlp", term: "MLP (multi-layer perceptron)", plain: "A small neural network made of layers of neurons.", lesson: "mlp" },
  { id: "g-mi", term: "Mutual information", plain: "How much one feature alone tells you about the target.", lesson: "mutual-info" },
  { id: "g-nested", term: "Nested cross-validation", plain: "A CV loop inside another, so choosing settings never touches the scoring folds.", lesson: "limits" },
  { id: "g-noir", term: "Nominal / ordinal / interval / ratio", plain: "Attribute types: labels; ordered labels; equal gaps; equal gaps with a true zero.", lesson: "at2-types" },
  { id: "g-onehot", term: "One-hot encoding", plain: "Turning one code into several 0/1 columns, one per level.", lesson: "one-hot" },
  { id: "g-onese", term: "One-standard-error rule", plain: "Models within one standard error of the top score count as tied. Then pick the simplest.", lesson: "one-se" },
  { id: "g-oof", term: "Out-of-fold predictions", plain: "Predictions for each row from a model that never saw that row.", lesson: "cutoff" },
  { id: "g-outlier", term: "Outlier", plain: "A value far from the rest.", lesson: "bmi-cap" },
  { id: "g-overfit", term: "Overfitting", plain: "Learning noise in the training data, so new data scores worse.", lesson: "logreg" },
  { id: "g-paired", term: "Paired bootstrap", plain: "Score two models on the same resampled people and check whether the difference interval includes 0.", lesson: "paired" },
  { id: "g-pca", term: "PCA", plain: "Squeezes many columns into a few, so data can be plotted.", lesson: "at2-clusters" },
  { id: "g-perm", term: "Permutation importance", plain: "Shuffle one column and measure how much the score drops.", lesson: "permutation" },
  { id: "g-pipeline", term: "Pipeline", plain: "Preprocessing steps and a model chained together, fitted on training data only.", lesson: "pipelines" },
  { id: "g-precision", term: "Precision", plain: "Of the people flagged, how many really have it: TP / (TP + FP).", lesson: "prec-spec-f1" },
  { id: "g-prevalence", term: "Prevalence", plain: "How common a condition is in the real population.", lesson: "data" },
  { id: "g-random", term: "Random search", plain: "Trying a fixed number of random setting combinations.", lesson: "grid-random" },
  { id: "g-rf", term: "Random forest", plain: "Bagging plus a random subset of features at each split.", lesson: "forest" },
  { id: "g-rbf", term: "RBF kernel", plain: "An SVM kernel that allows curved, local boundaries.", lesson: "rbf-linear" },
  { id: "g-recall", term: "Recall (sensitivity, TPR)", plain: "Of the people who have it, how many were caught: TP / (TP + FN).", lesson: "acc-recall" },
  { id: "g-regularisation", term: "Regularisation", plain: "Keeping weights small to reduce overfitting.", lesson: "logreg" },
  { id: "g-roc", term: "ROC curve", plain: "A plot of true positive rate against false positive rate at every cut-off.", lesson: "roc-auc" },
  { id: "g-scaling", term: "Scaling", plain: "Putting numbers on a similar range so no input dominates.", lesson: "scaling" },
  { id: "g-screening", term: "Screening", plain: "Ranking many people by risk, then testing the highest-risk first.", lesson: "screening-auc" },
  { id: "g-sd", term: "Standard deviation (SD)", plain: "How spread out values are around the mean.", lesson: "scaling" },
  { id: "g-se", term: "Standard error (SE)", plain: "How much an average could move by chance: SD / √(number of folds).", lesson: "one-se" },
  { id: "g-seed", term: "Seed", plain: "A fixed starting point for randomness, so results repeat exactly.", lesson: "split" },
  { id: "g-sigmoid", term: "Sigmoid", plain: "An S-shaped curve that turns any number into a probability between 0 and 1.", lesson: "logreg" },
  { id: "g-smoothing", term: "Smoothing", plain: "Replacing values with their bin mean or nearest bin boundary.", lesson: "at2-binning" },
  { id: "g-softvoting", term: "Soft voting", plain: "Averaging the predicted probabilities of several models.", lesson: "voting" },
  { id: "g-spearman", term: "Spearman correlation", plain: "A rank-based correlation that suits ordered or binary data. Pearson measures straight-line links.", lesson: "at2-correlation" },
  { id: "g-specificity", term: "Specificity", plain: "Of the people without it, how many were correctly cleared: TN / (TN + FP).", lesson: "prec-spec-f1" },
  { id: "g-stratify", term: "Stratify", plain: "Keep the same class mix in each part of a split.", lesson: "split" },
  { id: "g-supervised", term: "Supervised learning", plain: "Learning from examples where the answer is already known.", lesson: "problem-type" },
  { id: "g-svm", term: "SVM (support vector machine)", plain: "Finds the boundary with the widest margin between classes.", lesson: "svm" },
  { id: "g-target", term: "Target", plain: "The thing the model tries to predict.", lesson: "task" },
  { id: "g-leak-target", term: "Target leakage", plain: "An input that secretly contains the answer.", lesson: "pid-leak" },
  { id: "g-test", term: "Test set", plain: "Data kept aside and used once at the end for an honest score.", lesson: "split" },
  { id: "g-tradeoff", term: "Trade-off", plain: "Gaining one thing by giving up another.", lesson: "three-layers" },
  { id: "g-tuning", term: "Tuning", plain: "Trying many settings and keeping the best on validation data.", lesson: "tune-fn" },
  { id: "g-validation", term: "Validation data", plain: "The part used to choose settings. In CV, the fold left out.", lesson: "train-val-test" },
  { id: "g-valcurve", term: "Validation curve", plain: "A plot of training and validation scores as one setting changes.", lesson: "bias-variance" },
  { id: "g-variance", term: "Variance", plain: "How much a model changes with different training data. High variance means memorising noise.", lesson: "bias-variance" },
  { id: "g-zscore", term: "Z-score normalisation", plain: "(value − mean) / SD, giving mean 0 and spread 1.", lesson: "scaling" }
];
/* ===== END OF PART 2 of 2 ===== */
