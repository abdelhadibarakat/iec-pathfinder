/* =====================================================================
 * Copyright (c) 2026 Abdelhadi Barakat. All Rights Reserved.
 * Project: IEC Academic Advisor (PathFinder)
 * 
 * PROPRIETARY AND CONFIDENTIAL
 * Unauthorized copying, modification, reverse engineering, distribution,
 * or public display of this source code, via any medium, is strictly 
 * prohibited without explicit written permission from the author.
 * ===================================================================== */
/* ==========================================
   1. GLOBAL STATE & DATA
   ========================================== */
let currentStep = 1;
let currentPeriod = 1; // Tracks active selection round (1, 2, or 3)
let hasAttemptedSubmit = false;
let isEditMode = false; // Tracks if user jumped from Step 5

const MAX_PERIODS = 3;

const STEP_TITLES = {
    1: 'Student Profile',
    2: 'Grade & Section',
    3: 'Choose Courses',
    4: 'External Exams',
    5: 'Review & Submit'
};

const PERIOD_TITLES = {
    1: 'First Period',
    2: 'Second Period',
    3: 'Third Period'
};

// Independent memory for each period's category tab (all default to 0 / AP)
const periodCategoryMemory = {
    1: 0,
    2: 0,
    3: 0
};

const studentProfile = {
    firstName: '',
    lastName: '',
    gender: '',
    grade: null,
    section: '',
    periodSelections: {
        1: null,
        2: null,
        3: null
    },
    externalExamSelections: {
        1: false,
        2: false,
        3: false
    }
};

const steps = [
    { key: 'ap', title: 'AP' },
    { key: 'est', title: 'EST' },
    { key: 'national', title: 'National' }
];

let currentCategoryIndex = 0;
let isSearchActive = false;
let isSearchFocused = false;
let searchQuery = '';

const categoryScrollPositions = {
    ap: 0,
    est: 0,
    national: 0,
    search: 0
};

const historyCatalog = [
    // Period 1 (Only AP Available)
    { id: 'p1-ap-calc-boys', name: 'AP Calculus (Boys)', icon: '📐', type: 'ap', periods: [1], gender: 'male' },
    { id: 'p1-ap-micro', name: 'AP Microeconomics', icon: '📉', type: 'ap', periods: [1], gender: 'both' },
    { id: 'p1-ap-bus', name: 'AP Business with Personal Finance', icon: '💼', type: 'ap', periods: [1], gender: 'both' },
    { id: 'p1-ap-chem-girls', name: 'AP Chemistry (Girls)', icon: '🧪', type: 'ap', periods: [1], gender: 'female' },
    { id: 'p1-ap-comp', name: 'AP Comparative', icon: '🏛️', type: 'ap', periods: [1], gender: 'both' },
    { id: 'p1-ap-psych', name: 'AP Psychology', icon: '🧠', type: 'ap', periods: [1], gender: 'both' },

    // Period 2 (AP & National Available)
    { id: 'p2-ap-bus', name: 'AP Business with Personal Finance', icon: '💼', type: 'ap', periods: [2], gender: 'both' },
    { id: 'p2-jordan-hist-boys', name: 'Jordan History (Boys)', icon: '🇯🇴', type: 'national', periods: [2], gender: 'male' },
    { id: 'p2-ap-bio-girls', name: 'AP Biology (Girls)', icon: '🧬', type: 'ap', periods: [2], gender: 'female' },
    { id: 'p2-ap-psych-girls', name: 'AP Psychology (Girls)', icon: '🧠', type: 'ap', periods: [2], gender: 'female' },
    { id: 'p2-ap-sem', name: 'AP Seminar', icon: '📚', type: 'ap', periods: [2], gender: 'both' },
    { id: 'p2-ap-chem-boys', name: 'AP Chemistry (Boys)', icon: '🧪', type: 'ap', periods: [2], gender: 'male' },
    { id: 'p2-ap-bio-boys', name: 'AP Biology (Boys)', icon: '🧬', type: 'ap', periods: [2], gender: 'male' },
    { id: 'p2-ap-calc-girls', name: 'AP Calculus (Girls)', icon: '📐', type: 'ap', periods: [2], gender: 'female' },
    { id: 'p2-ap-macro', name: 'AP Macroeconomics', icon: '📊', type: 'ap', periods: [2], gender: 'both' },
    { id: 'p2-ap-csp', name: 'AP CSP', icon: '💻', type: 'ap', periods: [2], gender: 'both' },
    { id: 'p2-islamic-girls', name: 'Islamic Studies (Girls)', icon: '🕌', type: 'national', periods: [2], gender: 'female' },

    // Period 3 (AP & National Available)
    { id: 'p3-islamic-boys', name: 'Islamic Studies (Boys)', icon: '🕌', type: 'national', periods: [3], gender: 'male' },
    { id: 'p3-ap-human-geo-boys', name: 'AP Human Geography (Boys)', icon: '🌍', type: 'ap', periods: [3], gender: 'male' },
    { id: 'p3-ap-psych-girls', name: 'AP Psychology (Girls)', icon: '🧠', type: 'ap', periods: [3], gender: 'female' },
    { id: 'p3-ap-cyber-girls', name: 'AP Cybersecurity (Girls)', icon: '🛡️', type: 'ap', periods: [3], gender: 'female' },
    { id: 'p3-jordan-hist-girls', name: 'Jordan History (Girls)', icon: '🇯🇴', type: 'national', periods: [3], gender: 'female' },
    { id: 'p3-ap-bus-boys', name: 'AP Business with Personal Finance (Boys)', icon: '💼', type: 'ap', periods: [3], gender: 'male' },
    { id: 'p3-ap-psych-boys', name: 'AP Psychology (Boys)', icon: '🧠', type: 'ap', periods: [3], gender: 'male' },
    { id: 'p3-ap-physics-1', name: 'AP Physics 1', icon: '⚛️', type: 'ap', periods: [3], gender: 'both' },
    { id: 'p3-ap-micro-girls', name: 'AP Microeconomics (Girls)', icon: '📉', type: 'ap', periods: [3], gender: 'female' },
    { id: 'p3-ap-research', name: 'AP Research', icon: '🔍', type: 'ap', periods: [3], gender: 'both' },
    { id: 'p3-ap-cyber-boys', name: 'AP Cybersecurity (Boys)', icon: '🛡️', type: 'ap', periods: [3], gender: 'male' },
    { id: 'p3-ap-csp-boys', name: 'AP CSP (Boys)', icon: '💻', type: 'ap', periods: [3], gender: 'male' },
    { id: 'p3-ap-stats', name: 'AP Statistics', icon: '📈', type: 'ap', periods: [3], gender: 'both' },
    { id: 'p3-ap-csp-girls', name: 'AP CSP (Girls)', icon: '💻', type: 'ap', periods: [3], gender: 'female' },
    { id: 'p3-ap-env', name: 'AP Environmental Science', icon: '🌱', type: 'ap', periods: [3], gender: 'both' },
    { id: 'p3-ap-bio-girls', name: 'AP Biology (Girls)', icon: '🧬', type: 'ap', periods: [3], gender: 'female' }
];

// Returns the exact array of periods available for the student's grade
function getGradePeriods() {
    const g = Number(studentProfile.grade);
    if (g === 10) return [3];
    if (g === 11) return [2, 3];
    return [1, 2, 3];
}

function getPeriodTitle(p) {
    const g = Number(studentProfile.grade);
    if (g === 10) return 'Last Period';

    // Grade 11 takes periods 2 and 3, but displays as "First Period" and "Second Period"
    if (g === 11) {
        if (p === 2) return PERIOD_TITLES[1]; // "First Period"
        if (p === 3) return PERIOD_TITLES[2]; // "Second Period"
    }

    return PERIOD_TITLES[p] || `Period ${p}`;
}

/* ==========================================
   2. ERROR TRIGGER FUNCTIONS
   ========================================== */
function triggerErrorWithPop(inputElement) {
    const parentGroup = inputElement.closest('.floating-group');
    if (!parentGroup) return;

    parentGroup.classList.remove('animate-error');
    void parentGroup.offsetWidth;
    parentGroup.classList.add('error-state', 'animate-error');
}

function setStaticError(inputElement, isError) {
    const parentGroup = inputElement.closest('.floating-group');
    if (!parentGroup) return;

    if (isError) {
        parentGroup.classList.add('error-state');
    } else {
        parentGroup.classList.remove('error-state', 'animate-error');
    }
}

/* ==========================================
   3. PROGRESS BAR UPDATER
   ========================================== */
function updateProgressBar(stepNumber) {
    const fillLine = document.getElementById('header-progress-fill');
    if (!fillLine) return;

    if (isEditMode) {
        fillLine.style.width = '100%';
        return;
    }

    const gradePeriods = getGradePeriods();
    const periodIdx = gradePeriods.indexOf(currentPeriod);
    const periodFraction = periodIdx !== -1 ? (periodIdx + 1) / gradePeriods.length : 1;

    const percentages = {
        1: '20%',
        2: '40%',
        3: `${40 + periodFraction * 30}%`,
        4: '85%',
        5: '100%'
    };

    fillLine.style.width = percentages[stepNumber] || '20%';
}

/* ==========================================
   4. STEP 1: SUBMIT & GENDER SELECTION
   ========================================== */
function saveEditedName() {
    const firstNameInput = document.getElementById('first-name');
    const lastNameInput = document.getElementById('last-name');

    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();

    let isValid = true;

    if (!firstName) {
        triggerErrorWithPop(firstNameInput);
        isValid = false;
    } else {
        setStaticError(firstNameInput, false);
    }

    if (!lastName) {
        triggerErrorWithPop(lastNameInput);
        isValid = false;
    } else {
        setStaticError(lastNameInput, false);
    }

    if (!isValid) return;

    studentProfile.firstName = firstName;
    studentProfile.lastName = lastName;

    isEditMode = false;
    renderSummaryView();
    switchStep(1, 5);
}

function selectGender(gender) {
    hasAttemptedSubmit = true;

    const firstNameInput = document.getElementById('first-name');
    const lastNameInput = document.getElementById('last-name');

    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();

    let isValid = true;

    if (!firstName) {
        triggerErrorWithPop(firstNameInput);
        isValid = false;
    } else {
        setStaticError(firstNameInput, false);
    }

    if (!lastName) {
        triggerErrorWithPop(lastNameInput);
        isValid = false;
    } else {
        setStaticError(lastNameInput, false);
    }

    if (!isValid) return;

    studentProfile.firstName = firstName;
    studentProfile.lastName = lastName;
    studentProfile.gender = gender;

    document.querySelectorAll('.gender-card').forEach(b => b.classList.remove('active'));
    document.getElementById('card-' + gender).classList.add('active');

    if (isEditMode) {
        isEditMode = false;
        renderSummaryView();
        switchStep(1, 5);
        return;
    }

    switchStep(1, 2);
    document.getElementById('header-box').classList.add('played');
    restoreGradeAndSectionUI();
}

/* ==========================================
   5. STEP 2: GRADE & SECTION SELECTION
   ========================================== */
function toggleGradeCard(gradeNum) {
    const targetCard = document.getElementById('card-' + gradeNum);
    if (!targetCard) return;

    const isAlreadyActive = targetCard.classList.contains('active');

    // Visually toggle accordion card only (do not mutate studentProfile.grade yet)
    document.querySelectorAll('.card').forEach(b => b.classList.remove('active'));

    if (!isAlreadyActive) {
        targetCard.classList.add('active');
    }
}

function chooseSection(event, gradeNum, sectionLetter) {
    event.stopPropagation();

    // Accurately checks if the new grade differs from their existing grade
    const gradeChanged = studentProfile.grade !== null && Number(studentProfile.grade) !== Number(gradeNum);

    studentProfile.grade = gradeNum;
    studentProfile.section = sectionLetter;

    document.querySelectorAll('.section-btn').forEach(b => b.classList.remove('selected'));

    // If editing and only changing section (e.g., 11A -> 11B), return to Summary
    if (isEditMode && !gradeChanged) {
        isEditMode = false;
        renderSummaryView();
        switchStep(2, 5);
        return;
    }

    // If grade level changed, wipe previous choices and enforce fresh selection
    if (gradeChanged) {
        studentProfile.periodSelections = { 1: null, 2: null, 3: null };
        studentProfile.externalExamSelections = { 1: false, 2: false, 3: false };
        isEditMode = false;
    }

    // Direct user through the appropriate periods for the chosen grade
    const gradePeriods = getGradePeriods();
    currentPeriod = gradePeriods[0];

    switchStep(2, 3);
    renderActiveCategoryList(false);
}

function restoreGradeAndSectionUI() {
    document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.section-btn').forEach(b => b.classList.remove('selected'));

    if (studentProfile.grade) {
        const targetCard = document.getElementById('card-' + studentProfile.grade);
        if (targetCard) {
            targetCard.classList.add('active');
            targetCard.querySelectorAll('.section-btn').forEach(b => b.classList.remove('selected'));
        }
    }
}

/* ==========================================
   6. BACK & JUMP NAVIGATION
   ========================================== */
function switchStep(fromStep, toStep, customTitle = null) {
    const fromEl = document.getElementById(`step-${fromStep}`);
    const toEl = document.getElementById(`step-${toStep}`);
    const stepTitle = document.getElementById('step-title');
    const headerBox = document.getElementById('header-box');

    if (fromEl) fromEl.classList.add('hidden');
    if (toEl) {
        toEl.classList.remove('hidden', 'view-enter');
        void toEl.offsetWidth;
        toEl.classList.add('view-enter');
    }

    currentStep = toStep;

    if (stepTitle) {
        if (toStep === 3) {
            stepTitle.textContent = getPeriodTitle(currentPeriod);
        } else {
            stepTitle.textContent = customTitle || STEP_TITLES[toStep] || 'Academic Advisor';
        }
    }

    // Step 1 never has a back button.
    // In edit mode: NEVER show the back button on ANY page.
    if (toStep === 1 || isEditMode) {
        headerBox.classList.remove('played');
    } else {
        headerBox.classList.add('played');
    }

    updateProgressBar(toStep);
    syncUIForStep(toStep);
    updateButtonLabels();
}

function editFromSummary(targetStep, targetCourseId = null, targetType = null, targetPeriod = null) {
    isEditMode = true;
    studentProfile.editingPeriod = targetPeriod || null;

    if (targetStep === 3 && targetPeriod) {
        currentPeriod = targetPeriod;
        isSearchActive = false;
        searchQuery = '';
        isSearchFocused = false;

        if (targetCourseId) {
            const course = historyCatalog.find(c => c.id === targetCourseId);
            if (course) {
                const dynamicSteps = getActiveDynamicSteps();
                const matchedIdx = dynamicSteps.findIndex(s => s.key === course.type);
                currentCategoryIndex = matchedIdx !== -1 ? matchedIdx : 0;
            } else {
                currentCategoryIndex = periodCategoryMemory[currentPeriod] || 0;
            }
        } else {
            currentCategoryIndex = periodCategoryMemory[currentPeriod] || 0;
        }
        periodCategoryMemory[currentPeriod] = currentCategoryIndex;
    }

    switchStep(5, targetStep);

    if (targetStep === 1) {
        const genderContainer = document.getElementById('gender-selection-container');
        const confirmContainer = document.getElementById('edit-name-confirm-container');
        if (genderContainer) genderContainer.classList.add('hidden');
        if (confirmContainer) confirmContainer.classList.remove('hidden');
    }

    if (targetStep === 2) {
        restoreGradeAndSectionUI();
    }

    if (targetStep === 3) {
        renderProgressStepper();
        renderActiveCategoryList(false);

        if (targetCourseId) {
            const cardEl = document.getElementById(`card-${targetCourseId}`);
            if (cardEl) {
                cardEl.scrollIntoView({ behavior: 'auto', block: 'nearest' });
            }
        }
    }
}

function goBack() {
    const headerBox = document.getElementById('header-box');
    const badgeRow = document.getElementById('badge-row');
    const stepTitle = document.getElementById('step-title');

    // From Step 5 Summary -> Back to Step 4 External Exams
    if (currentStep === 5) {
        if (isEditMode) {
            isEditMode = false;
            studentProfile.editingPeriod = null;
            renderSummaryView();
            return;
        }
        renderExternalExamCards();
        switchStep(5, 4);
        return;
    }

    // From Step 4 External Exams -> Back to Step 3
    if (currentStep === 4) {
        if (isEditMode && studentProfile.editingPeriod) {
            currentPeriod = studentProfile.editingPeriod;
            switchStep(4, 3);
            renderProgressStepper();
            renderActiveCategoryList(false);
            updateGlobalActionButton();
            return;
        }

        const gradePeriods = getGradePeriods();
        currentPeriod = gradePeriods[gradePeriods.length - 1];
        currentCategoryIndex = periodCategoryMemory[currentPeriod] || 0;
        isSearchActive = false;
        searchQuery = '';
        isSearchFocused = false;

        switchStep(4, 3);
        renderProgressStepper();
        renderActiveCategoryList(false);
        updateGlobalActionButton();
        return;
    }

    // From Step 3 -> Traverse backwards through grade periods
    if (currentStep === 3) {
        if (isEditMode) {
            isEditMode = false;
            studentProfile.editingPeriod = null;
            renderSummaryView();
            switchStep(3, 5);
            return;
        }

        const gradePeriods = getGradePeriods();
        const currentIdx = gradePeriods.indexOf(currentPeriod);

        if (currentIdx > 0) {
            currentPeriod = gradePeriods[currentIdx - 1];
            currentCategoryIndex = periodCategoryMemory[currentPeriod] || 0;
            isSearchActive = false;
            searchQuery = '';
            isSearchFocused = false;

            if (stepTitle) stepTitle.textContent = getPeriodTitle(currentPeriod);
            updateProgressBar(3);
            renderProgressStepper();
            renderActiveCategoryList(true);
            updateGlobalActionButton();
            return;
        }

        handleListScroll();
        switchStep(3, 2);
        restoreGradeAndSectionUI();
        return;
    }

    // From Step 2 -> Step 1
    if (currentStep === 2) {
        isEditMode = false;
        studentProfile.editingPeriod = null;
        if (headerBox) headerBox.classList.remove('played');
        if (badgeRow) badgeRow.style.justifyContent = 'center';
        if (stepTitle) stepTitle.textContent = STEP_TITLES[1];
        switchStep(2, 1);
    }
}

/* ==========================================
   7. STEP 3: SELECT COURSES LOGIC
   ========================================== */
function getValidCoursesForCurrentPeriod() {
    const availableThisPeriod = historyCatalog.filter(c => c.periods.includes(currentPeriod));
    const chosenOtherPeriods = new Set();
    for (let p = 1; p <= MAX_PERIODS; p++) {
        if (p !== currentPeriod && studentProfile.periodSelections[p]) {
            chosenOtherPeriods.add(studentProfile.periodSelections[p]);
        }
    }
    return availableThisPeriod.filter(c => !chosenOtherPeriods.has(c.id));
}

function getActiveDynamicSteps() {
    const validCourses = getValidCoursesForCurrentPeriod();
    return steps.filter(step => validCourses.some(c => c.type === step.key));
}

function handleListScroll() {
    const listContainer = document.getElementById('active-category-list');
    if (!listContainer) return;
    const dynamicSteps = getActiveDynamicSteps();
    const activeKey = isSearchActive ? 'search' : (dynamicSteps[currentCategoryIndex]?.key || 'ap');
    categoryScrollPositions[`${currentPeriod}_${activeKey}`] = listContainer.scrollTop;
}

function renderProgressStepper() {
    const container = document.getElementById('stepper-tab-container');
    const searchBtn = document.getElementById('btn-standalone-search');
    if (!container) return;

    const dynamicSteps = getActiveDynamicSteps();

    if (currentCategoryIndex >= dynamicSteps.length) {
        currentCategoryIndex = 0;
        periodCategoryMemory[currentPeriod] = 0;
    }

    if (dynamicSteps.length === 0) {
        container.innerHTML = '';
        container.className = "hidden";
    } else if (dynamicSteps.length === 1) {
        const step = dynamicSteps[0];
        const isActive = !isSearchActive;

        container.onmousedown = (e) => e.preventDefault();
        container.onclick = function(e) {
            this.blur();
            switchCategory(0);
        };
        container.className = `btn-outside-search ${isActive ? 'active' : ''}`;
        container.style.flex = "1";
        container.style.width = "auto";
        container.style.minWidth = "0";
        container.style.height = "4.4rem";
        container.style.fontSize = "1.15rem";
        container.style.fontWeight = "800";
        container.style.cursor = "pointer";
        container.innerHTML = `<span>${step.title}</span>`;
        currentCategoryIndex = 0;
        periodCategoryMemory[currentPeriod] = 0;
    } else {
        container.onclick = null;
        container.onmousedown = null;
        container.className = "progress-tab-wrapper";
        container.style.flex = "1";
        container.style.width = "";
        container.style.minWidth = "";
        container.style.height = "";
        container.style.fontSize = "";
        container.style.fontWeight = "";
        container.style.cursor = "";

        let html = '';
        dynamicSteps.forEach((step, idx) => {
            const isCurrent = !isSearchActive && idx === currentCategoryIndex;
            html += `
                <div class="progress-tab ${isCurrent ? 'active' : ''}" onmousedown="event.preventDefault()" onclick="this.blur(); switchCategory(${idx})">
                    <span>${step.title}</span>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    if (searchBtn) {
        if (isSearchActive) {
            searchBtn.classList.add('active');
        } else {
            searchBtn.classList.remove('active');
        }
    }
}

function switchCategory(targetIndex) {
    const dynamicSteps = getActiveDynamicSteps();
    const prevKey = isSearchActive ? 'search' : (dynamicSteps[currentCategoryIndex]?.key || 'ap');
    const listContainer = document.getElementById('active-category-list');
    
    if (listContainer) {
        categoryScrollPositions[`${currentPeriod}_${prevKey}`] = listContainer.scrollTop;
        listContainer.classList.remove('accordion-active', 'expanded');
    }

    isSearchActive = false;
    isSearchFocused = false;
    currentCategoryIndex = targetIndex;
    
    periodCategoryMemory[currentPeriod] = targetIndex;

    renderActiveCategoryList(true);
    renderProgressStepper();
}

function handleSearchFocus() {
    isSearchFocused = true;
    const listContainer = document.getElementById('active-category-list');
    if (listContainer) {
        listContainer.classList.add('accordion-active', 'expanded');
    }
}

function handleSearchBlur(event) {
    const input = document.getElementById('course-search-input');
    
    if (!isSearchActive) return;
    if (event && event.relatedTarget) {
        if (event.relatedTarget.id === 'btn-global-action' || 
            event.relatedTarget.closest('#stepper-tab-container') || 
            event.relatedTarget.closest('#btn-standalone-search')) {
            return;
        }
    }

    if (searchQuery.trim() === '' && document.activeElement !== input) {
        isSearchFocused = false;
        const listContainer = document.getElementById('active-category-list');
        if (listContainer && isSearchActive) {
            listContainer.classList.add('accordion-active');
            listContainer.classList.remove('expanded');
        }
    }
}

function toggleSearchMode(event) {
    if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
    }

    const dynamicSteps = getActiveDynamicSteps();
    const prevKey = isSearchActive ? 'search' : (dynamicSteps[currentCategoryIndex]?.key || 'ap');
    const listContainer = document.getElementById('active-category-list');
    
    if (listContainer) {
        categoryScrollPositions[`${currentPeriod}_${prevKey}`] = listContainer.scrollTop;
    }

    isSearchActive = !isSearchActive;
    
    if (!isSearchActive) {
        if (listContainer) {
            listContainer.classList.remove('accordion-active', 'expanded');
        }
        isSearchFocused = false;
        searchQuery = '';
    }

    renderActiveCategoryList(false);
    renderProgressStepper();

    if (isSearchActive) {
        const searchContainer = document.getElementById('search-view-container');
        const input = document.getElementById('course-search-input');
        const searchBtn = document.getElementById('btn-standalone-search');
        if (searchBtn) searchBtn.blur();

        if (searchContainer) {
            void searchContainer.offsetWidth;
        }

        if (input) {
            input.focus();
            if (typeof input.setSelectionRange === 'function') {
                const len = input.value.length;
                input.setSelectionRange(len, len);
            }
            handleSearchFocus();

            setTimeout(() => {
                input.focus();
                handleSearchFocus();
            }, 30);
        }
    } else {
        const input = document.getElementById('course-search-input');
        if (input) input.blur();
    }
}

function renderActiveCategoryList(isTabSwitch = false) {
    const listContainer = document.getElementById('active-category-list');
    const searchContainer = document.getElementById('search-view-container');
    const searchInput = document.getElementById('course-search-input');

    if (!listContainer || !searchContainer) return;

    if (isSearchActive) {
        searchContainer.classList.remove('hidden');

        const hasSavedQuery = searchQuery.trim() !== '';
        const isExpanded = isSearchFocused || hasSavedQuery;
        
        listContainer.className = `space-y-3 search-viewport custom-scroll ${isExpanded ? 'expanded' : ''}`;
        
        if (searchInput && searchInput.value !== searchQuery) {
            searchInput.value = searchQuery;
        }
    } else {
        searchContainer.classList.add('hidden');
        listContainer.className = "space-y-3 courses-viewport custom-scroll mb-6";
        
        if (isTabSwitch) {
            listContainer.classList.remove('view-enter');
            void listContainer.offsetWidth;
            listContainer.classList.add('view-enter');
        }
    }

    const validCatalog = getValidCoursesForCurrentPeriod();
    const dynamicSteps = getActiveDynamicSteps();

    if (currentCategoryIndex >= dynamicSteps.length) {
        currentCategoryIndex = 0;
        periodCategoryMemory[currentPeriod] = 0;
    }

    let coursesToDisplay = [];
    if (isSearchActive) {
        const query = searchQuery.trim().toLowerCase();
        coursesToDisplay = query === '' 
            ? validCatalog 
            : validCatalog.filter(c => c.name.toLowerCase().includes(query));
    } else {
        if (dynamicSteps.length > 0) {
            const currentStepData = dynamicSteps[currentCategoryIndex] || dynamicSteps[0];
            coursesToDisplay = validCatalog.filter(c => c.type === currentStepData.key);
        }
    }

    const currentGender = (studentProfile.gender || 'female').toLowerCase();
    coursesToDisplay.sort((a, b) => {
        const getRank = (item) => {
            if (item.gender === currentGender) return 1;
            if (item.gender === 'both') return 2;
            return 3;
        };
        return getRank(a) - getRank(b);
    });

    if (coursesToDisplay.length === 0) {
        listContainer.innerHTML = `
            <div class="py-4 text-center text-slate-400 font-semibold text-sm">
                ${isSearchActive ? `No courses found matching "${searchQuery}"` : `No courses available in this category for ${PERIOD_TITLES[currentPeriod]}.`}
            </div>
        `;
        renderProgressStepper();
        updateGlobalActionButton();
        return;
    }

    const currentSelectedId = studentProfile.periodSelections[currentPeriod];

    let html = '';
    coursesToDisplay.forEach(course => {
        const isSelected = currentSelectedId === course.id;

        html += `
            <div id="card-${course.id}" class="selectable-course-card ${isSelected ? 'selected' : ''}" style="transform: none !important;" onmousedown="event.preventDefault()" onclick="toggleCourse('${course.id}')">
                <div class="flex items-center gap-3 overflow-hidden">
                    <span class="text-2xl shrink-0">${course.icon}</span>
                    <span class="font-extrabold text-sm sm:text-base text-slate-700 truncate">${course.name}</span>
                </div>
                <div class="select-label-group shrink-0">
                    <span id="hint-${course.id}" class="select-text-hint">${isSelected ? 'Selected' : 'Select'}</span>
                </div>
            </div>
        `;
    });

    listContainer.innerHTML = html;

    const activeKey = isSearchActive ? 'search' : (dynamicSteps[currentCategoryIndex]?.key || 'ap');
    const scrollKey = `${currentPeriod}_${activeKey}`;
    listContainer.scrollTop = categoryScrollPositions[scrollKey] || 0;

    renderProgressStepper();
    updateGlobalActionButton();
}

function handleSearchInput(query) {
    searchQuery = query;
    isSearchFocused = true;
    categoryScrollPositions.search = 0;
    renderActiveCategoryList(false);
}

function toggleCourse(id) {
    if (studentProfile.periodSelections[currentPeriod] === id) {
        // Deselecting course -> reset exam selection
        studentProfile.periodSelections[currentPeriod] = null;
        studentProfile.externalExamSelections[currentPeriod] = false;
    } else {
        // Switching to a new / different course -> reset exam selection to default (not selected)
        studentProfile.periodSelections[currentPeriod] = id;
        studentProfile.externalExamSelections[currentPeriod] = false;
    }
    renderActiveCategoryList(false);
}

/* ==========================================
   8. ACTION BUTTONS, STEP 4 & SYNC HELPERS
   ========================================== */
function updateButtonLabels() {
    const maleLabel = document.getElementById('label-gender-male');
    const femaleLabel = document.getElementById('label-gender-female');

    if (isEditMode) {
        if (maleLabel) maleLabel.textContent = 'Confirm';
        if (femaleLabel) femaleLabel.textContent = 'Confirm';
    } else {
        if (maleLabel) maleLabel.textContent = 'Next';
        if (femaleLabel) femaleLabel.textContent = 'Next';
    }
    
    updateGlobalActionButton();
}

function isSkipBlocked() {
    const grade = Number(studentProfile.grade);

    if (!studentProfile.periodSelections) {
        studentProfile.periodSelections = { 1: null, 2: null, 3: null };
    }

    // Grades 10 & 11: All available classes are strictly required
    if (grade === 10 || grade === 11) {
        return true;
    }

    // Grade 12: Must pick at least 2 courses out of 3
    if (isEditMode) {
        let total = 0;
        [1, 2, 3].forEach(p => {
            if (studentProfile.periodSelections[p]) total++;
        });
        return total < 2;
    }

    let pastCount = 0;
    for (let p = 1; p < currentPeriod; p++) {
        if (studentProfile.periodSelections[p]) pastCount++;
    }
    const remainingChances = 3 - currentPeriod;
    return (pastCount + remainingChances) < 2;
}

function updateGlobalActionButton() {
    const btn = document.getElementById('btn-global-action');
    const label = document.getElementById('global-btn-label');
    const icon = document.getElementById('global-btn-icon');
    if (!btn || !label || !icon) return;

    btn.classList.remove('animate-submit-shake');

    if (!studentProfile.periodSelections) {
        studentProfile.periodSelections = { 1: null, 2: null, 3: null };
    }

    const hasSelection = Boolean(studentProfile.periodSelections[currentPeriod]);

    // 1. If skipping is mathematically blocked during normal flow
    if (!hasSelection && isSkipBlocked()) {
        btn.className = 'btn-step-action is-error apple-corner font-extrabold text-xl';
        label.textContent = "Required";
        icon.classList.add('hidden');
        return;
    }

    // 2. Edit Mode: ALWAYS Confirm (with arrow icon)
    if (isEditMode) {
        btn.className = 'btn-step-action is-continue apple-corner font-extrabold text-xl';
        label.textContent = "Confirm";
        icon.classList.remove('hidden');
        return;
    }

    // 3. Normal Wizard Progression
    if (hasSelection) {
        btn.className = 'btn-step-action is-continue apple-corner font-extrabold text-xl';
        label.textContent = "Next";
        icon.classList.remove('hidden');
    } else {
        btn.className = 'btn-step-action is-skip apple-corner font-extrabold text-xl';
        label.textContent = "Skip";
        icon.classList.remove('hidden');
    }
}

function handleGlobalAction(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    const btn = document.getElementById('btn-global-action');

    if (!studentProfile.periodSelections) {
        studentProfile.periodSelections = { 1: null, 2: null, 3: null };
    }

    const hasSelection = Boolean(studentProfile.periodSelections[currentPeriod]);

    if (!hasSelection && isSkipBlocked()) {
        if (btn) {
            btn.blur();
            btn.classList.remove('animate-submit-shake');
            void btn.offsetWidth;
            btn.classList.add('animate-submit-shake');
        }
        return;
    }

    handleListScroll();

    // In Edit Mode:
    if (isEditMode && studentProfile.editingPeriod) {
        if (hasSelection) {
            renderExternalExamCards(studentProfile.editingPeriod);
            switchStep(3, 4);
        } else {
            studentProfile.externalExamSelections[studentProfile.editingPeriod] = false;
            isEditMode = false;
            studentProfile.editingPeriod = null;
            renderSummaryView();
            switchStep(3, 5);
        }
        return;
    }

    // Normal progression through available grade periods
    const gradePeriods = getGradePeriods();
    const currentIdx = gradePeriods.indexOf(currentPeriod);

    if (currentIdx !== -1 && currentIdx < gradePeriods.length - 1) {
        if (btn) {
            btn.blur();
            const freshBtn = btn.cloneNode(true);
            btn.replaceWith(freshBtn);
            freshBtn.onclick = handleGlobalAction;
        }

        currentPeriod = gradePeriods[currentIdx + 1];

        currentCategoryIndex = periodCategoryMemory[currentPeriod] || 0;
        isSearchActive = false;
        searchQuery = '';
        isSearchFocused = false;

        const stepTitle = document.getElementById('step-title');
        if (stepTitle) stepTitle.textContent = getPeriodTitle(currentPeriod);
        updateProgressBar(3);
        renderProgressStepper();
        renderActiveCategoryList(true);
        updateGlobalActionButton();
        return;
    }

    // Finished all periods for this grade -> Advance to Step 4
    renderExternalExamCards();
    switchStep(3, 4);
}

/* --- STEP 4 EXTERNAL EXAMS HANDLERS --- */
function renderExternalExamCards(singlePeriod = null) {
    const listContainer = document.getElementById('external-courses-list');
    if (!listContainer) return;

    const subtextWrap = document.getElementById('external-subtext-wrap');
    if (subtextWrap) {
        // Keep the message visible in both normal flow and edit mode
        subtextWrap.classList.remove('is-hidden');

        // Check if singular (Grade 10 or editing a single period)
        const isSingular = singlePeriod !== null || Number(studentProfile.grade) === 10;
        const labelSpan = subtextWrap.querySelector('span');

        if (labelSpan) {
            labelSpan.textContent = isSingular 
                ? "Will you test for this course?" 
                : "Which courses will you test for?";
        }
    }

    listContainer.innerHTML = '';
    const gradePeriods = getGradePeriods();
    let hasEnrolledCourses = false;

    const periodsToRender = singlePeriod ? [singlePeriod] : gradePeriods;

    for (const p of periodsToRender) {
        const courseId = studentProfile.periodSelections[p];
        if (!courseId) continue;

        const course = historyCatalog.find(c => c.id === courseId);
        if (!course) continue;

        hasEnrolledCourses = true;
        const isSelected = Boolean(studentProfile.externalExamSelections[p]);

        const card = document.createElement('div');
        card.id = `card-ext-${p}`;
        card.className = `selectable-course-card ${isSelected ? 'selected' : ''}`;
        card.style.transform = 'none !important';
        card.onmousedown = (e) => e.preventDefault();
        card.onclick = () => toggleExternalCourse(p);

        card.innerHTML = `
            <div class="flex items-center gap-3 overflow-hidden">
                <span class="text-2xl shrink-0">${course.icon}</span>
                <span class="font-extrabold text-sm sm:text-base text-slate-700 truncate">${course.name}</span>
            </div>
            <div class="select-label-group shrink-0">
                <span id="hint-ext-${p}" class="select-text-hint">${isSelected ? 'Selected' : 'Select'}</span>
            </div>
        `;

        listContainer.appendChild(card);
    }

    if (!hasEnrolledCourses) {
        listContainer.innerHTML = `
            <div class="py-8 text-center text-slate-400 font-semibold text-sm">
                No courses enrolled to take external exams for.
            </div>
        `;
    }

    updateExternalActionButton();
}

function toggleExternalCourse(periodNum) {
    studentProfile.externalExamSelections[periodNum] = !studentProfile.externalExamSelections[periodNum];

    const card = document.getElementById(`card-ext-${periodNum}`);
    const hint = document.getElementById(`hint-ext-${periodNum}`);
    const isSelected = Boolean(studentProfile.externalExamSelections[periodNum]);

    if (card) card.classList.toggle('selected', isSelected);
    if (hint) hint.textContent = isSelected ? 'Selected' : 'Select';

    updateExternalActionButton();
}

function updateExternalActionButton() {
    const btn = document.getElementById('btn-external-action');
    const label = document.getElementById('external-btn-label');
    const icon = document.getElementById('external-btn-icon');
    if (!btn || !label || !icon) return;

    // In edit mode: always Confirm
    if (isEditMode) {
        btn.className = 'btn-step-action is-continue apple-corner font-extrabold text-xl';
        label.textContent = "Confirm";
        icon.classList.remove('hidden');
        return;
    }

    const hasAnySelected = Object.values(studentProfile.externalExamSelections).some(Boolean);

    if (hasAnySelected) {
        btn.className = 'btn-step-action is-continue apple-corner font-extrabold text-xl';
        label.textContent = "Next";
        icon.classList.remove('hidden');
    } else {
        btn.className = 'btn-step-action is-skip apple-corner font-extrabold text-xl';
        label.textContent = "Skip";
        icon.classList.add('hidden');
    }
}

function handleExternalAction(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Tapping Confirm in edit mode returns to Preview (Step 5)
    if (isEditMode) {
        isEditMode = false;
        studentProfile.editingPeriod = null;
        renderSummaryView();
        switchStep(4, 5);
        return;
    }

    renderSummaryView();
    switchStep(4, 5);
}

function syncUIForStep(stepNumber) {
    if (stepNumber === 1) {
        const fnInput = document.getElementById('first-name');
        const lnInput = document.getElementById('last-name');
        const genderContainer = document.getElementById('gender-selection-container');
        const confirmContainer = document.getElementById('edit-name-confirm-container');

        if (fnInput) fnInput.value = studentProfile.firstName || '';
        if (lnInput) lnInput.value = studentProfile.lastName || '';

        if (isEditMode) {
            if (genderContainer) genderContainer.classList.add('hidden');
            if (confirmContainer) confirmContainer.classList.remove('hidden');
        } else {
            if (genderContainer) genderContainer.classList.remove('hidden');
            if (confirmContainer) confirmContainer.classList.add('hidden');
        }

        document.querySelectorAll('.gender-card').forEach(b => b.classList.remove('active'));
        if (studentProfile.gender) {
            const activeGenderCard = document.getElementById('card-' + studentProfile.gender);
            if (activeGenderCard) activeGenderCard.classList.add('active');
        }
    }

    if (stepNumber === 2) {
        restoreGradeAndSectionUI();
    }

    if (stepNumber === 3) {
        currentCategoryIndex = periodCategoryMemory[currentPeriod] || 0;
        renderActiveCategoryList(false);
        renderProgressStepper();
        updateGlobalActionButton();
    }

    if (stepNumber === 4) {
        renderExternalExamCards(isEditMode ? studentProfile.editingPeriod : null);
    }

    if (stepNumber === 5) {
        renderSummaryView();
    }
}

/* ==========================================
   9. STEP 5: SUMMARY VIEW & GENDER TOGGLE
   ========================================== */
function toggleGenderOnSummary(event) {
    if (event) event.stopPropagation();
    
    const currentGender = studentProfile.gender ? studentProfile.gender.toLowerCase() : 'female';
    studentProfile.gender = (currentGender === 'female') ? 'male' : 'female';
    
    renderSummaryView();
}

function renderSummaryView() {
    const fullName = `${studentProfile.firstName || 'Student'} ${studentProfile.lastName || ''}`.trim();
    const previewName = document.getElementById('preview-name');
    if (previewName) previewName.textContent = fullName;

    const genderCard = document.getElementById('preview-gender-card');
    const genderText = document.getElementById('preview-gender-text');
    const isFemale = (studentProfile.gender ? studentProfile.gender.toLowerCase() : 'female') === 'female';

    if (genderCard) {
        genderCard.classList.remove('male', 'female');
        genderCard.classList.add(isFemale ? 'female' : 'male');
    }
    if (genderText) {
        genderText.textContent = isFemale ? 'Female' : 'Male';
    }

    const previewGradeText = document.getElementById('preview-grade-text');
    if (previewGradeText) {
        const gradeVal = studentProfile.grade || 10;
        const sectionVal = studentProfile.section || 'A';
        previewGradeText.textContent = `${gradeVal}${sectionVal}`;
    }

    const courseListContainer = document.getElementById('preview-course-list');
    if (!courseListContainer) return;
    courseListContainer.innerHTML = '';

    courseListContainer.classList.add('is-scrollable');
    courseListContainer.classList.remove('single-mode');

    const gradePeriods = getGradePeriods();
    for (const p of gradePeriods) {
        const selectedId = studentProfile.periodSelections[p];
        const course = selectedId ? historyCatalog.find(c => c.id === selectedId) : null;
        const hasCourse = Boolean(course);
        const titleLabel = getPeriodTitle(p);

        // Course selected -> "Taking Exam" vs "Course Only"
        // No course selected -> Period title (e.g. "Last Period", "Second Period")
        let badgeText = titleLabel;
        if (hasCourse) {
            badgeText = studentProfile.externalExamSelections[p] ? 'Taking Exam' : 'Course Only';
        }

        const card = document.createElement('div');
        card.className = 'course-badge-row-clickable flex items-center justify-between px-5 w-full';
        card.onclick = () => editFromSummary(3, selectedId, null, p);
        card.title = `Click to edit ${titleLabel}`;

        card.innerHTML = `
            <div class="flex items-center gap-3 overflow-hidden pr-2">
                <span class="text-xl shrink-0 flex items-center justify-center">
                    ${hasCourse 
                        ? course.icon 
                        : `<svg class="w-5 h-5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8" stroke="currentColor" /></svg>`}
                </span>
                <span class="font-extrabold text-sm sm:text-base truncate ${hasCourse ? 'text-slate-800' : 'text-slate-400'}">
                    ${hasCourse ? course.name : 'Not Selected'}
                </span>
            </div>
            <div class="select-label-group shrink-0">
                <span class="select-text-hint">
                    ${badgeText}
                </span>
            </div>
        `;

        courseListContainer.appendChild(card);
    }
}

/* ==========================================
   10. REAL-TIME TYPING LISTENERS
   ========================================== */
['first-name', 'last-name'].forEach(id => {
    const input = document.getElementById(id);
    if (!input) return;

    input.addEventListener('input', function () {
        if (!hasAttemptedSubmit) return;
        const isEmpty = this.value.trim() === '';
        setStaticError(this, isEmpty);
    });
});

/* ==========================================
   11. MOBILE TAP FOCUS CLEARANCE
   ========================================== */
document.addEventListener('touchend', function (e) {
    const target = e.target.closest('button, .card, .gender-card, .selectable-course-card, .course-badge-row-clickable, .progress-tab, .btn-outside-search, .left-arrow-column');
    if (target) {
        setTimeout(() => target.blur(), 50);
    }
}, { passive: true });

/* ==========================================
   12. GOOGLE SHEETS SUBMISSION & FLOW
   ========================================== */
const GOOGLE_SHEET_URL = '';
let isSubmissionLocked = false;

function getDeviceMacAddress() {
    try {
        let mac = localStorage.getItem('school_device_mac_address');
        if (!mac) {
            const hexDigits = '0123456789ABCDEF';
            const octets = [];
            for (let i = 0; i < 6; i++) {
                octets.push(hexDigits[Math.floor(Math.random() * 16)] + hexDigits[Math.floor(Math.random() * 16)]);
            }
            mac = octets.join(':');
            localStorage.setItem('school_device_mac_address', mac);
        }
        return mac;
    } catch (e) {
        return 'UNKNOWN_DEVICE';
    }
}

function getSimpleDeviceType() {
    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/i.test(ua)) return 'Apple iOS';
    if (/Android/i.test(ua)) return 'Android Mobile';
    if (/Windows/i.test(ua)) return 'Windows PC';
    if (/Macintosh/i.test(ua)) return 'Mac OS';
    return 'Other';
}

async function submitFinalEnrollment() {
    if (isSubmissionLocked) return;
    isSubmissionLocked = true;

    function cleanStr(s) {
        if (!s) return '';
        return String(s).replace(/\p{Extended_Pictographic}/gu, '').trim();
    }

    const firstName = cleanStr(studentProfile?.firstName || document.getElementById('first-name')?.value);
    const lastName = cleanStr(studentProfile?.lastName || document.getElementById('last-name')?.value);

    if (!firstName || !lastName) {
        isSubmissionLocked = false;
        if (typeof editFromSummary === 'function') editFromSummary(1);
        return;
    }

    const gender = cleanStr(studentProfile?.gender || 'Female');
    const grade = cleanStr(studentProfile?.grade || '10');
    const section = cleanStr(studentProfile?.section || 'A').toUpperCase();

    const gradePeriods = getGradePeriods();

    // Course period resolver
    let countSelected = 0;
    function resolvePeriodCourse(periodNum) {
        // If this period is not offered for the grade, leave as empty string
        if (!gradePeriods.includes(periodNum)) return '';

        if (!studentProfile?.periodSelections) return 'None';
        const item = studentProfile.periodSelections[periodNum];
        if (!item) return 'None';

        if (typeof item === 'object' && item.name) {
            countSelected++;
            return cleanStr(item.name);
        }

        if (typeof historyCatalog !== 'undefined' && Array.isArray(historyCatalog)) {
            const found = historyCatalog.find(c => String(c.id) === String(item));
            if (found && found.name) {
                countSelected++;
                return cleanStr(found.name);
            }
        }

        if (typeof item === 'string' && item.trim().length > 0 && item !== 'None') {
            countSelected++;
            return cleanStr(item);
        }

        return 'None';
    }

    const p1 = resolvePeriodCourse(1);
    const p2 = resolvePeriodCourse(2);
    const p3 = resolvePeriodCourse(3);

    // Resolves Yes/No only if a course was taken; returns '' (empty) if not offered OR 'None'
    const resolveExam = (periodNum, resolvedCourse) => {
        if (!gradePeriods.includes(periodNum)) return '';
        if (!resolvedCourse || resolvedCourse === 'None') return '';
        return studentProfile.externalExamSelections?.[periodNum] ? 'Yes' : 'No';
    };

    // Equivalency: Grade 12 taking exactly 2 periods gets "Yes"/"No", others empty
    const isGrade12 = Number(grade) === 12;
    let equivalencyValue = "";
    if (isGrade12) {
        equivalencyValue = (countSelected === 2) ? "Yes" : "No";
    }

    const submitBtn = document.getElementById('btn-final-submit');
    const btnText = document.getElementById('submit-btn-text');
    const btnIcon = document.getElementById('submit-btn-icon');
    const headerBox = document.getElementById('header-box');
    const subtextWrap = document.getElementById('summary-subtext-wrap');

    const isRetryAttempt = submitBtn?.classList.contains('is-error');

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.pointerEvents = 'none';
        submitBtn.classList.remove('animate-submit-shake');
        submitBtn.classList.add('is-submitting');
    }
    if (btnText) btnText.textContent = isRetryAttempt ? 'Retrying' : 'Submitting';
    if (btnIcon) btnIcon.classList.add('hidden');

    const payload = {
        deviceType: getSimpleDeviceType(),
        macAddress: getDeviceMacAddress(),
        firstName: firstName,
        lastName: lastName,
        gender: gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase(),
        grade: grade,
        section: section,
        firstPeriod: p1,
        firstPeriodExam: resolveExam(1, p1),
        secondPeriod: p2,
        secondPeriodExam: resolveExam(2, p2),
        thirdPeriod: p3,
        thirdPeriodExam: resolveExam(3, p3),
        equivalency: equivalencyValue
    };

    // 50-second timeout matches the 45s waitLock window on backend
    const controller = new AbortController();
    const timeoutTimer = setTimeout(() => controller.abort(), 50000);

    try {
        await fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload),
            signal: controller.signal
        });

        clearTimeout(timeoutTimer);

        const stepTitle = document.getElementById('step-title');
        if (stepTitle) stepTitle.textContent = "You're All Set!";

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.style.pointerEvents = 'none';
            submitBtn.className = 'btn-step-action is-success apple-corner font-extrabold text-xl';
        }
        if (btnText) btnText.textContent = 'Submitted';
        if (btnIcon) {
            btnIcon.classList.remove('hidden');
            btnIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />`;
        }

        if (headerBox) headerBox.classList.remove('played');
        if (subtextWrap) subtextWrap.classList.add('is-hidden');

        ['preview-name-card', 'preview-gender-card', 'preview-grade-card'].forEach(id => {
            const card = document.getElementById(id);
            if (card) {
                card.onclick = null;
                card.classList.add('summary-locked');
            }
        });

        document.querySelectorAll('#preview-course-list .course-badge-row-clickable').forEach(el => {
            el.onclick = null;
            el.classList.add('summary-locked');
        });

    } catch (err) {
        clearTimeout(timeoutTimer);
        console.error('Submission failed or timed out:', err);

        isSubmissionLocked = false;

        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.style.pointerEvents = 'auto';
            submitBtn.className = 'btn-step-action is-error apple-corner font-extrabold text-xl animate-submit-shake';
        }
        if (btnText) btnText.textContent = 'Retry';
        if (btnIcon) {
            btnIcon.classList.remove('hidden');
            btnIcon.innerHTML = `
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            `;
        }
    }
}