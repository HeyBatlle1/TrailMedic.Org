import React, { useState } from 'react';
import { Search, BookOpen, AlertTriangle, Clock, Target, Shield, Leaf, Skull, Baby, Heart } from 'lucide-react';

// Enhanced medical guides with comprehensive, actionable information
const FIRST_AID_GUIDES = [
  {
    id: '1',
    title: 'Hemorrhage Control',
    category: 'Critical Care',
    icon: <Target className="w-5 h-5" />,
    content: `IMMEDIATE ACTIONS:
• Apply direct pressure with clean cloth/gauze
• Elevate injury above heart level if possible
• If bleeding persists: apply pressure to arterial pressure points
• Tourniquet application: 2-3 inches above wound, tighten until bleeding stops

PRESSURE POINTS:
• Arm: Brachial artery (inner upper arm)
• Leg: Femoral artery (groin crease)
• Head/Neck: Carotid artery (side of neck)

TOURNIQUET PROTOCOL:
• Use only for life-threatening limb bleeding
• Note application time - maximum 2 hours
• Do NOT remove once applied
• Mark "TK" and time on patient's forehead`,
    severity: 'critical',
    tags: ['bleeding', 'hemorrhage', 'tourniquet', 'pressure'],
    timeToRead: '2 min'
  },
  {
    id: '2',
    title: 'Fracture Management',
    category: 'Trauma Care',
    icon: <Shield className="w-5 h-5" />,
    content: `ASSESSMENT PROTOCOL:
• Check circulation: pulse, color, temperature below injury
• Test sensation: can patient feel touch?
• Motor function: can patient move fingers/toes?

IMMOBILIZATION TECHNIQUE:
• Splint in position found - do NOT realign
• Immobilize joint above and below fracture
• Pad all bony prominences
• Secure with triangular bandages or improvised materials

OPEN FRACTURE PROTOCOL:
• Cover exposed bone with sterile dressing
• Do NOT push bone back into wound
• Apply traction only if circulation compromised
• Monitor for shock - elevate legs, maintain warmth`,
    severity: 'high',
    tags: ['fracture', 'bone', 'splint', 'immobilization'],
    timeToRead: '3 min'
  },
  {
    id: '3',
    title: 'Thermal Injury Management',
    category: 'Critical Care',
    icon: <AlertTriangle className="w-5 h-5" />,
    content: `BURN CLASSIFICATION:
• 1st Degree: Red, painful, no blisters
• 2nd Degree: Blisters, severe pain
• 3rd Degree: White/charred, no pain (nerve damage)

IMMEDIATE TREATMENT:
• Remove from heat source immediately
• Cool with room temperature water 10-20 minutes
• Remove jewelry/clothing before swelling
• Do NOT use ice, butter, or oils

CRITICAL BURNS (Evacuate immediately):
• Burns >10% body surface area
• Burns to face, hands, feet, genitals
• Electrical or chemical burns
• Inhalation injury suspected

FLUID REPLACEMENT:
• Conscious patient: sips of water
• Severe burns: prepare for shock treatment`,
    severity: 'critical',
    tags: ['burn', 'thermal', 'fire', 'heat', 'cooling'],
    timeToRead: '3 min'
  },
  {
    id: '4',
    title: 'Hypothermia Protocol',
    category: 'Environmental',
    icon: <Clock className="w-5 h-5" />,
    content: `STAGES OF HYPOTHERMIA:
• Mild (90-95°F): Shivering, confusion, clumsiness
• Moderate (82-90°F): Violent shivering stops, muscle rigidity
• Severe (<82°F): Unconscious, barely detectable pulse

REWARMING PROTOCOL:
• Move to warm, dry environment
• Remove wet clothing - cut if necessary
• Insulate entire body, head to toe
• Apply heat packs to trunk, neck, armpits, groin

CRITICAL WARNINGS:
• Handle patient gently - rough movement can cause cardiac arrest
• Do NOT give alcohol or caffeine
• Do NOT massage extremities
• Rewarm core before extremities

FIELD EXPEDIENT WARMING:
• Body-to-body contact in sleeping bag
• Warm (not hot) water bottles wrapped in cloth
• Reflective emergency blankets`,
    severity: 'critical',
    tags: ['hypothermia', 'cold', 'temperature', 'rewarming'],
    timeToRead: '3 min'
  },
  {
    id: '5',
    title: 'Envenomation Management',
    category: 'Toxicology',
    icon: <Skull className="w-5 h-5" />,
    content: `SNAKE BITE PROTOCOL:
• Keep victim calm and still
• Remove jewelry before swelling
• Immobilize bitten extremity below heart level
• Mark swelling progression with pen and time

DO NOT:
• Cut the wound or attempt suction
• Apply tourniquet or ice
• Give alcohol or stimulants
• Allow victim to walk unless absolutely necessary

SPIDER/SCORPION BITES:
• Clean wound with soap and water
• Apply cold compress for pain
• Monitor for systemic symptoms
• Collect specimen if safely possible

MARINE ENVENOMATION:
• Remove visible tentacles with tweezers
• Rinse with vinegar (jellyfish) or hot water (stingray)
• Do NOT use fresh water on jellyfish stings`,
    severity: 'critical',
    tags: ['snake', 'bite', 'venom', 'poison', 'envenomation'],
    timeToRead: '3 min'
  },
  {
    id: '6',
    title: 'Airway Management',
    category: 'Critical Care',
    icon: <Target className="w-5 h-5" />,
    content: `AIRWAY ASSESSMENT:
• Look: chest rise and fall
• Listen: air movement sounds
• Feel: air on your cheek

OBSTRUCTION CLEARANCE:
• Conscious adult: 5 back blows, 5 abdominal thrusts
• Unconscious: 30 chest compressions, check mouth, 2 breaths
• Infant: 5 back blows, 5 chest thrusts

HEAD TILT-CHIN LIFT:
• Place hand on forehead, tilt head back
• Lift chin with fingertips (not thumb)
• Do NOT use if spinal injury suspected

JAW THRUST (Spinal injury):
• Place fingers behind jaw angles
• Lift jaw forward without moving neck
• Maintain cervical spine alignment

RECOVERY POSITION:
• Place on side with head tilted back
• Top leg bent for stability
• Monitor breathing continuously`,
    severity: 'critical',
    tags: ['airway', 'breathing', 'obstruction', 'cpr'],
    timeToRead: '2 min'
  },
  {
    id: '7',
    title: 'Natural Medicine & Dosages',
    category: 'Wilderness Medicine',
    icon: <Leaf className="w-5 h-5" />,
    content: `PAIN RELIEF & FEVER:
• Willow Bark (Salix species): Contains salicin
  - Dosage: 1-2 tsp dried bark per 8oz water, steep 15 min
  - Frequency: 3-4 times daily
  - Max: 6 cups/day (equivalent to ~1200mg aspirin)
  - Caution: Same contraindications as aspirin

• White Birch Bark: Anti-inflammatory
  - Inner bark tea: 1 tbsp per cup, steep 10 min
  - Frequency: 2-3 times daily
  - Duration: Maximum 7 days

WOUND CARE & ANTISEPTIC:
• Plantain (Plantago major): Natural antibiotic
  - Fresh: Chew leaves, apply as poultice
  - Dried: 1 tsp per cup water for wash
  - Application: Change every 4-6 hours
  - Duration: Until healing progresses

• Yarrow (Achillea millefolium): Hemostatic
  - Fresh leaves: Crush and apply directly
  - Tea: 1-2 tsp dried herb per cup
  - Frequency: 2-3 applications daily
  - Warning: May cause skin sensitivity

DIGESTIVE DISORDERS:
• Peppermint (Mentha piperita): Antispasmodic
  - Fresh leaves: 6-12 leaves per cup
  - Dried: 1 tsp per cup, steep 5-10 min
  - Frequency: After meals, max 4 cups/day
  - Caution: Avoid with GERD

• Wild Ginger: Anti-nausea
  - Fresh root: 1/4 tsp grated per cup
  - Chew small pieces for motion sickness
  - Max: 4g daily (about 1 tsp)
  - Pregnancy: Limit to 1g daily

RESPIRATORY SUPPORT:
• Pine Needle Tea: Vitamin C (5x more than oranges)
  - Young needles: 1/4 cup per 8oz hot water
  - Steep: 5-10 minutes (longer = bitter)
  - Frequency: 2-3 cups daily
  - Species: Avoid Ponderosa Pine (toxic to pregnant)

• Mullein (Verbascum thapsus): Expectorant
  - Leaves: 1-2 tsp dried per cup
  - Smoking: Small amount of dried leaves
  - Tea frequency: 3-4 times daily
  - Strain well (remove tiny hairs)

OVERDOSE SIGNS TO WATCH:
• Willow bark: Nausea, ringing in ears, stomach pain
• Pine needles: Kidney irritation with excessive use
• Any herb: Allergic reactions, skin rash, breathing difficulty

CRITICAL IDENTIFICATION RULES:
• 100% positive ID required - when in doubt, don't use
• Start with small test doses
• One new plant at a time
• Have someone monitor you after first use`,
    severity: 'medium',
    tags: ['natural', 'medicine', 'plants', 'herbal', 'wilderness', 'dosage'],
    timeToRead: '6 min'
  },
  {
    id: '8',
    title: 'Toxic Plants & Poisons',
    category: 'Toxicology',
    icon: <Skull className="w-5 h-5" />,
    content: `DEADLY PLANTS TO AVOID:
• Water Hemlock: Most poisonous plant in North America
  - Looks like wild carrot/parsnip
  - Causes violent convulsions, death in hours
• Castor Bean: Contains ricin
  - Attractive red/brown seeds
  - 1-2 seeds can kill an adult

CONTACT POISONS:
• Poison Ivy/Oak/Sumac: "Leaves of three, let it be"
  - Causes severe dermatitis
  - Wash with dish soap immediately
• Giant Hogweed: Causes severe burns
  - Tall plant with large umbrella flowers

MUSHROOM POISONING:
• Death Cap: Responsible for 90% of mushroom deaths
  - White gills, bulbous base, ring on stem
  - Symptoms delayed 6-12 hours

TREATMENT PROTOCOL:
• Remove from mouth immediately
• Rinse mouth with water
• Do NOT induce vomiting unless instructed
• Save sample of plant/mushroom
• Activated charcoal if available (not for caustic substances)

UNIVERSAL ANTIDOTE MYTH:
• No universal antidote exists
• Treatment is specific to toxin type`,
    severity: 'critical',
    tags: ['poison', 'toxic', 'plants', 'mushrooms', 'antidote'],
    timeToRead: '4 min'
  },
  {
    id: '9',
    title: 'Pediatric Emergency Medicine',
    category: 'Pediatric Care',
    icon: <Baby className="w-5 h-5" />,
    content: `CRITICAL PEDIATRIC DIFFERENCES:

AIRWAY MANAGEMENT:
• Children have proportionally larger heads - pad shoulders, not head
• Tongue is larger relative to mouth - more likely to obstruct
• Airway is smaller - swelling causes rapid obstruction
• Infant rescue breathing: Cover mouth AND nose
• Child CPR: 30 compressions, 2 breaths (same ratio as adult)
• Compression depth: 1/3 chest depth (about 1.5" infant, 2" child)

VITAL SIGNS BY AGE:
• Infant (0-1yr): HR 100-160, RR 30-60, BP 70-100 systolic
• Toddler (1-3yr): HR 90-150, RR 24-40, BP 80-110 systolic
• Child (3-12yr): HR 80-120, RR 18-30, BP 90-120 systolic

FLUID LOSS & DEHYDRATION:
• Children dehydrate MUCH faster than adults
• Higher surface area to body weight ratio
• Signs: Sunken fontanelle (infants), no tears when crying
• Oral rehydration: 5ml every 5 minutes for infants
• Avoid plain water in infants - can cause seizures

MEDICATION DOSING:
• NEVER guess pediatric doses
• Weight-based dosing essential
• Acetaminophen: 10-15mg/kg every 4-6 hours
• Ibuprofen: 5-10mg/kg every 6-8 hours (>6 months only)
• Aspirin: NEVER in children (Reye's syndrome risk)

TRAUMA CONSIDERATIONS:
• Children's bones bend before breaking - suspect internal injury
• Head injuries more serious - brain swelling in rigid skull
• Hypothermia develops faster - larger head surface area
• Blood loss: 10% loss in child = 20% loss in adult (shock)

CHOKING DIFFERENCES:
• Infant (<1yr): 5 back blows, 5 chest thrusts (NO abdominal thrusts)
• Child (>1yr): Back blows, then abdominal thrusts
• Blind finger sweeps NEVER in children - may push object deeper

FEVER MANAGEMENT:
• Rectal temp most accurate in infants
• Fever >100.4°F (38°C) in infant <3 months = medical emergency
• Febrile seizures: Common in children, usually not dangerous
• Cool with lukewarm water, never alcohol or ice

PSYCHOLOGICAL CONSIDERATIONS:
• Separation anxiety peaks 6 months - 3 years
• Keep parent/caregiver close when possible
• Explain procedures in age-appropriate language
• Use distraction techniques during procedures

NATURAL MEDICINE MODIFICATIONS:
• Dosing: 1/4 adult dose for ages 2-6, 1/2 dose for ages 6-12
• Avoid: Honey in infants <1 year (botulism risk)
• Avoid: Aspirin-containing plants (willow bark) in children
• Pine needle tea: Safe in small amounts for children >2 years

EMERGENCY PRIORITIES:
1. Airway (most common cause of cardiac arrest in children)
2. Breathing (respiratory failure before cardiac arrest)
3. Circulation (children compensate well until sudden decompensation)`,
    severity: 'critical',
    tags: ['pediatric', 'children', 'infant', 'dosing', 'airway', 'cpr'],
    timeToRead: '7 min'
  },
  {
    id: '10',
    title: 'Shock Recognition & Treatment',
    category: 'Critical Care',
    icon: <Heart className="w-5 h-5" />,
    content: `SHOCK TYPES & RECOGNITION:

HYPOVOLEMIC SHOCK (Blood/fluid loss):
• Early signs: Rapid pulse, pale skin, anxiety
• Late signs: Weak pulse, cold/clammy skin, confusion
• Critical: Unconsciousness, absent pulse

CARDIOGENIC SHOCK (Heart failure):
• Chest pain, difficulty breathing
• Jugular vein distension
• Pulmonary edema (pink frothy sputum)

NEUROGENIC SHOCK (Spinal injury):
• Slow pulse with low blood pressure
• Warm, dry skin below injury level
• Loss of temperature regulation

ANAPHYLACTIC SHOCK (Severe allergic reaction):
• Rapid onset after exposure
• Difficulty breathing, swelling
• Hives, itching, sense of doom

TREATMENT PROTOCOL:
• Position: Legs elevated 12 inches (unless spinal injury)
• Airway: Maintain open airway
• Breathing: Assist if needed
• Circulation: Control bleeding, IV access if trained
• Disability: Immobilize spine if indicated
• Exposure: Prevent heat loss, examine for injuries

FLUID REPLACEMENT:
• Conscious patient: Small sips of water
• Oral rehydration solution if available
• Do NOT give fluids if:
  - Unconscious
  - Vomiting
  - Abdominal injury suspected

MONITORING:
• Pulse: Rate, strength, regularity
• Breathing: Rate, depth, effort
• Skin: Color, temperature, moisture
• Mental status: Alert, confused, unconscious
• Urine output: Should be 30ml/hour minimum

EVACUATION CRITERIA:
• Any signs of shock require immediate evacuation
• Shock can be rapidly fatal without proper treatment
• Field treatment is temporary stabilization only`,
    severity: 'critical',
    tags: ['shock', 'circulation', 'blood pressure', 'emergency'],
    timeToRead: '4 min'
  }
];

type GuideSeverity = 'low' | 'medium' | 'high' | 'critical';

interface GuideItem {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  content: string;
  severity: GuideSeverity;
  tags: string[];
  timeToRead: string;
}

const Guides: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [guides, setGuides] = useState<GuideItem[]>(FIRST_AID_GUIDES);

  const categories = ['all', ...Array.from(new Set(FIRST_AID_GUIDES.map(guide => guide.category)))];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterGuides(term, selectedCategory);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    filterGuides(searchTerm, category);
  };

  const filterGuides = (searchTerm: string, category: string) => {
    let filtered = FIRST_AID_GUIDES;

    if (category !== 'all') {
      filtered = filtered.filter(guide => guide.category === category);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(guide => 
        guide.title.toLowerCase().includes(searchTerm) || 
        guide.content.toLowerCase().includes(searchTerm) ||
        guide.tags.some(tag => tag.includes(searchTerm)) ||
        guide.category.toLowerCase().includes(searchTerm)
      );
    }
    
    setGuides(filtered);
  };

  const getSeverityColor = (severity: GuideSeverity) => {
    switch (severity) {
      case 'critical': return 'from-red-900 to-red-700 border-red-500';
      case 'high': return 'from-orange-900 to-orange-700 border-orange-500';
      case 'medium': return 'from-yellow-900 to-yellow-700 border-yellow-500';
      case 'low': return 'from-blue-900 to-blue-700 border-blue-500';
      default: return 'from-gray-900 to-gray-700 border-gray-500';
    }
  };

  const getSeverityLabel = (severity: GuideSeverity) => {
    switch (severity) {
      case 'critical': return 'CRITICAL';
      case 'high': return 'HIGH';
      case 'medium': return 'MODERATE';
      case 'low': return 'LOW';
      default: return 'UNKNOWN';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex items-center mb-6">
        <BookOpen className="text-green-500 mr-3" size={28} />
        <h2 className="text-3xl font-bold text-white">Medical Field Guides</h2>
      </div>
      
      {/* Search and Filter Controls */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={20} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            className="bg-gray-800 border border-gray-600 w-full pl-10 pr-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Search medical procedures, symptoms, treatments..."
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryFilter(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {category === 'all' ? 'All Guides' : category}
            </button>
          ))}
        </div>
      </div>
      
      {guides.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
          <AlertTriangle className="text-yellow-500 mx-auto mb-4" size={48} />
          <p className="text-gray-300 mb-2 text-lg">No guides found</p>
          <p className="text-gray-400 text-sm">
            Try adjusting your search terms or category filter
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {guides.map(guide => (
            <div 
              key={guide.id}
              className={`bg-gradient-to-br ${getSeverityColor(guide.severity)} border-2 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-black/30 p-2 rounded-lg">
                    {guide.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg leading-tight">
                      {guide.title}
                    </h3>
                    <p className="text-gray-300 text-sm">{guide.category}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <span className="bg-black/50 text-white px-2 py-1 rounded text-xs font-bold">
                    {getSeverityLabel(guide.severity)}
                  </span>
                  <div className="flex items-center text-gray-300 text-xs">
                    <Clock size={12} className="mr-1" />
                    {guide.timeToRead}
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="bg-black/20 rounded-lg p-4 mb-4">
                <div className="text-gray-100 text-sm whitespace-pre-line leading-relaxed font-mono">
                  {guide.content}
                </div>
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {guide.tags.slice(0, 4).map(tag => (
                  <span 
                    key={tag}
                    className="bg-black/30 text-gray-300 px-2 py-1 rounded text-xs"
                  >
                    #{tag}
                  </span>
                ))}
                {guide.tags.length > 4 && (
                  <span className="text-gray-400 text-xs px-2 py-1">
                    +{guide.tags.length - 4} more
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-12 bg-gray-800 border border-gray-700 rounded-lg p-6 text-center">
        <AlertTriangle className="text-red-500 mx-auto mb-3" size={32} />
        <h3 className="text-lg font-bold text-white mb-2">Medical Disclaimer</h3>
        <p className="text-gray-300 text-sm leading-relaxed">
          These guides are for emergency wilderness situations only where professional medical care is unavailable. 
          They do not replace proper medical training or professional medical advice. Always seek qualified medical 
          assistance when available. Misuse of this information could result in serious injury or death.
        </p>
      </div>
    </div>
  );
};

export default Guides;