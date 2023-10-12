from core.models import Settings, Round


def get_settings():
    return Settings.load()


def get_active_round() -> Round:
    return get_settings().active_round


def is_at_phase(phase):
    return get_active_round().is_at_phase(phase)
